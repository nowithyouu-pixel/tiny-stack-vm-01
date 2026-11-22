import{readFileSync as R,readdirSync as D,mkdirSync as M,writeFileSync as W}from'node:fs'
const I=process.env.MAKEFUN_INPUT_DIR||'/input',O=process.env.MAKEFUN_OUTPUT_DIR||'/output'
const T='01146abf0000000099999995999599909990000000000000044000000000000058000000000000004414'
const F=[(a,b)=>a+b|0,(a,b)=>a-b|0,Math.imul,(a,b)=>(a/b)|0,(a,b)=>a%b|0,(a,b)=>((a>>>0)/(b>>>0))|0,(a,b)=>(a>>>0)%(b>>>0)|0,0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,0,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>(a>>>(b&31))|0,0,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>a>>>0<b>>>0?1:0]
function run(p,n){
 const S=new Int32Array(256),V=new Int32Array(256),C=new Int32Array(64),o=new Uint8Array(65536)
 let pc=0,sp=0,cp=0,ip=0,st=0,ol=0
 const end=e=>[o.subarray(0,ol),e]
 for(;;){
  if(st===1e6)return end(10)
  if(pc<0||pc>=p.length)return end(9)
  const op=p[pc]
  if(!(op<8||op>15&&op<31||op>31&&op<35||op>47&&op<53||op>63&&op<66||op>79&&op<84))return end(5)
  const im=op===1?1:op===2?4:op>47&&op<52?2:0
  if(pc+im>=p.length)return end(9)
  st++
  const nx=pc+1+im,v=parseInt(T[op],16),u=v>>2,g=v&3,rl=im===2?((p[nx-2]|p[nx-1]<<8)<<16>>16):0
  if(sp<u)return end(2)
  if(sp-u+g>256)return end(3)
  pc=nx
  switch(op){
   case 0:return end(0)
   case 1:S[sp++]=p[nx-1]<<24>>24;break
   case 2:S[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break
   case 3:sp--;break
   case 4:S[sp]=S[sp-1];sp++;break
   case 5:{const t=S[sp-1];S[sp-1]=S[sp-2];S[sp-2]=t;break}
   case 6:S[sp]=S[sp-2];sp++;break
   case 7:{const a=S[sp-3];S[sp-3]=S[sp-2];S[sp-2]=S[sp-1];S[sp-1]=a;break}
   case 23:S[sp-1]=-S[sp-1]|0;break
   case 27:S[sp-1]=~S[sp-1];break
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    if(op>18&&op<23&&!S[sp-1])return end(4)
    const b=S[sp-1],a=S[sp-2]
    sp-=2;S[sp++]=F[op-16](a,b);break}
   case 48:pc=nx+rl;break
   case 49:case 50:{const v=S[--sp];if(op===49?v===0:v!==0)pc=nx+rl;break}
   case 51:{if(cp===64)return end(7);C[cp++]=nx;pc=p[nx-2]|p[nx-1]<<8;break}
   case 52:{if(!cp)return end(8);pc=C[--cp];break}
   case 64:{const a=S[sp-1];if(a<0||a>255)return end(6);S[sp-1]=V[a];break}
   case 65:{const a=S[sp-1];if(a<0||a>255)return end(6);V[a]=S[sp-2];sp-=2;break}
   case 80:{const s=''+S[sp-1];if(ol+s.length>65536)return end(11);sp--;o.set(Buffer.from(s),ol);ol+=s.length;break}
   case 81:{if(ol>=65536)return end(11);o[ol++]=S[--sp]&255;break}
   case 82:S[sp++]=ip<n.length?n[ip++]:-1;break
   case 83:return end(S[--sp]&255)
  }
 }
}
for(const d of D(I).sort()){
 const A=I+'/'+d,B=O+'/'+d,[o,e]=run(R(A+'/program.bin'),R(A+'/input.bin'))
 M(B,{recursive:true});W(B+'/stdout.bin',o);W(B+'/exit.txt',e+'\n')
}
