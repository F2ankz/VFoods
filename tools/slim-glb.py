import json,struct,numpy as np,io,sys
src,dst=sys.argv[1],sys.argv[2]
d=open(src,'rb').read()
clen,_=struct.unpack('<II',d[12:20]); j=json.loads(d[20:20+clen]); bo=20+clen+8
CT={5126:'<f4',5123:'<u2',5125:'<u4',5122:'<i2',5121:'u1',5120:'i1'}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def arr(ai):
    a=j['accessors'][ai]; bv=j['bufferViews'][a['bufferView']]
    off=bo+bv.get('byteOffset',0)+a.get('byteOffset',0)
    return np.frombuffer(d,dtype=CT[a['componentType']],count=a['count']*NC[a['type']],offset=off).reshape(a['count'],NC[a['type']])
out=io.BytesIO(); views=[]; accs=[]
def add(data,comp,typ,count,mn,mx,normalized=False,target=None):
    while out.tell()%4: out.write(b'\0')
    off=out.tell(); out.write(data.tobytes())
    bv={'buffer':0,'byteOffset':off,'byteLength':out.tell()-off}
    if target: bv['target']=target
    views.append(bv)
    a={'bufferView':len(views)-1,'componentType':comp,'count':count,'type':typ,'min':mn,'max':mx}
    if normalized: a['normalized']=True
    accs.append(a); return len(accs)-1
nodes=[]
for n in j['nodes']:
    mesh=j['meshes'][n['mesh']]
    lo=np.full(3,np.inf); hi=np.full(3,-np.inf)
    for p in mesh['primitives']:
        P=arr(p['attributes']['POSITION']); lo=np.minimum(lo,P.min(0)); hi=np.maximum(hi,P.max(0))
    c=(lo+hi)/2; h=np.maximum((hi-lo)/2,1e-6); prims=[]
    for p in mesh['primitives']:
        P=arr(p['attributes']['POSITION']).astype(np.float64)
        N=arr(p['attributes']['NORMAL']).astype(np.float64)
        I=arr(p['indices']).reshape(-1)
        q=np.clip(np.rint((P-c)/h*32767),-32767,32767).astype('<i2')
        qn=np.clip(np.rint(N*127),-127,127).astype('i1')
        idt='<u2' if len(P)<=65535 else '<u4'; qi=I.astype(idt)
        ap=add(q,5122,'VEC3',len(q),q.min(0).tolist(),q.max(0).tolist(),target=34962)
        an=add(qn,5120,'VEC3',len(qn),qn.min(0).tolist(),qn.max(0).tolist(),normalized=True,target=34962)
        ai=add(qi,5123 if idt=='<u2' else 5125,'SCALAR',len(qi),[int(qi.min())],[int(qi.max())],target=34963)
        prims.append({'attributes':{'POSITION':ap,'NORMAL':an},'indices':ai,'material':p['material']})
    # quantization puts the dequantize transform on the node, so it has to be
    # composed with whatever transform the node already carried — dropping it
    # teleports the part to the origin
    assert 'rotation' not in n, n['name']
    t0 = np.array(n.get('translation', [0.0, 0.0, 0.0]), dtype=np.float64)
    s0 = np.array(n.get('scale', [1.0, 1.0, 1.0]), dtype=np.float64)
    nodes.append({'name': n['name'], 'mesh': n['mesh'],
                  'translation': [float(v) for v in (t0 + s0 * c)],
                  'scale': [float(v) for v in (s0 * h / 32767)]})
    mesh['primitives']=prims
j['nodes']=nodes; j['accessors']=accs; j['bufferViews']=views
j['buffers']=[{'byteLength':out.tell()}]
j['extensionsUsed']=sorted(set(j.get('extensionsUsed',[]))|{'KHR_mesh_quantization'})
j['extensionsRequired']=sorted(set(j.get('extensionsRequired',[]))|{'KHR_mesh_quantization'})
j['asset']['generator']='VFOODS glb slimmer (decimate + KHR_mesh_quantization)'
bin_=out.getvalue()
if len(bin_)%4: bin_+=b'\0'*(4-len(bin_)%4)
js=json.dumps(j,separators=(',',':')).encode()
if len(js)%4: js+=b' '*(4-len(js)%4)
glb=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(bin_))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(bin_),0x004E4942)+bin_
open(dst,'wb').write(glb)
print('%s: %.2f MB -> %.2f MB' % (dst, len(d)/1048576, len(glb)/1048576))
