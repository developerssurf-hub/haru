import{r as c,j as t,db as R,h0 as Fe,h1 as Ae,h2 as $e,h3 as lt,eV as ct,h4 as dt,h5 as ut,h6 as ft,h7 as pt,h8 as gt,h9 as Ie,a as D,ha as ee,hb as g,T as C,I as y,k as x,R as F,F as te,u as Pe,hc as ht,hd as U,bG as ve,da as mt,he as xt,hf as jt,hg as ge,H as L,aY as Le,N as vt,U as Z,g2 as re,s as se,dQ as ae,dl as bt,di as Ct,dj as yt,c as be,eO as he,eQ as It,eS as wt,eN as St,eP as Mt,eR as _e,q as Rt,cq as A,A as ne,bx as Dt,hh as Tt,hi as Et,hj as Ft,hk as At,L as ce,gg as $t,gh as Pt,dV as Lt,hl as de,ah as _t,hm as kt,fG as Nt,hn as Ot,P as we,O as Gt,Q as Ut}from"./strapi-CWUq5KQv.js";import{g as Bt}from"./users-DLc-PG84.js";function Vt(e,n=[]){let o=[];function s(l,a){const i=c.createContext(a),u=o.length;o=[...o,a];const p=f=>{const{scope:m,children:j,...v}=f,b=m?.[e]?.[u]||i,h=c.useMemo(()=>v,Object.values(v));return t.jsx(b.Provider,{value:h,children:j})};p.displayName=l+"Provider";function d(f,m){const j=m?.[e]?.[u]||i,v=c.useContext(j);if(v)return v;if(a!==void 0)return a;throw new Error(`\`${f}\` must be used within \`${l}\``)}return[p,d]}const r=()=>{const l=o.map(a=>c.createContext(a));return function(i){const u=i?.[e]||l;return c.useMemo(()=>({[`__scope${e}`]:{...i,[e]:u}}),[i,u])}};return r.scopeName=e,[s,Ht(r,...n)]}function Ht(...e){const n=e[0];if(e.length===1)return n;const o=()=>{const s=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(l){const a=s.reduce((i,{useScope:u,scopeName:p})=>{const f=u(l)[`__scope${p}`];return{...i,...f}},{});return c.useMemo(()=>({[`__scope${n.scopeName}`]:a}),[a])}};return o.scopeName=n.scopeName,o}function Se(e,n){if(typeof e=="function")return e(n);e!=null&&(e.current=n)}function ke(...e){return n=>{let o=!1;const s=e.map(r=>{const l=Se(r,n);return!o&&typeof l=="function"&&(o=!0),l});if(o)return()=>{for(let r=0;r<s.length;r++){const l=s[r];typeof l=="function"?l():Se(e[r],null)}}}}function me(...e){return c.useCallback(ke(...e),e)}function xe(e){const n=zt(e),o=c.forwardRef((s,r)=>{const{children:l,...a}=s,i=c.Children.toArray(l),u=i.find(qt);if(u){const p=u.props.children,d=i.map(f=>f===u?c.Children.count(p)>1?c.Children.only(null):c.isValidElement(p)?p.props.children:null:f);return t.jsx(n,{...a,ref:r,children:c.isValidElement(p)?c.cloneElement(p,void 0,d):null})}return t.jsx(n,{...a,ref:r,children:l})});return o.displayName=`${e}.Slot`,o}function zt(e){const n=c.forwardRef((o,s)=>{const{children:r,...l}=o;if(c.isValidElement(r)){const a=Qt(r),i=Kt(l,r.props);return r.type!==c.Fragment&&(i.ref=s?ke(s,a):a),c.cloneElement(r,i)}return c.Children.count(r)>1?c.Children.only(null):null});return n.displayName=`${e}.SlotClone`,n}var Wt=Symbol("radix.slottable");function qt(e){return c.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===Wt}function Kt(e,n){const o={...n};for(const s in n){const r=e[s],l=n[s];/^on[A-Z]/.test(s)?r&&l?o[s]=(...i)=>{const u=l(...i);return r(...i),u}:r&&(o[s]=r):s==="style"?o[s]={...r,...l}:s==="className"&&(o[s]=[r,l].filter(Boolean).join(" "))}return{...e,...o}}function Qt(e){let n=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,o=n&&"isReactWarning"in n&&n.isReactWarning;return o?e.ref:(n=Object.getOwnPropertyDescriptor(e,"ref")?.get,o=n&&"isReactWarning"in n&&n.isReactWarning,o?e.props.ref:e.props.ref||e.ref)}var Zt=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],W=Zt.reduce((e,n)=>{const o=xe(`Primitive.${n}`),s=c.forwardRef((r,l)=>{const{asChild:a,...i}=r,u=a?o:n;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),t.jsx(u,{...i,ref:l})});return s.displayName=`Primitive.${n}`,{...e,[n]:s}},{});function B(e,n,{checkForDefaultPrevented:o=!0}={}){return function(r){if(e?.(r),o===!1||!r.defaultPrevented)return n?.(r)}}function Yt(e,n=[]){let o=[];function s(l,a){const i=c.createContext(a),u=o.length;o=[...o,a];const p=f=>{const{scope:m,children:j,...v}=f,b=m?.[e]?.[u]||i,h=c.useMemo(()=>v,Object.values(v));return t.jsx(b.Provider,{value:h,children:j})};p.displayName=l+"Provider";function d(f,m){const j=m?.[e]?.[u]||i,v=c.useContext(j);if(v)return v;if(a!==void 0)return a;throw new Error(`\`${f}\` must be used within \`${l}\``)}return[p,d]}const r=()=>{const l=o.map(a=>c.createContext(a));return function(i){const u=i?.[e]||l;return c.useMemo(()=>({[`__scope${e}`]:{...i,[e]:u}}),[i,u])}};return r.scopeName=e,[s,Xt(r,...n)]}function Xt(...e){const n=e[0];if(e.length===1)return n;const o=()=>{const s=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(l){const a=s.reduce((i,{useScope:u,scopeName:p})=>{const f=u(l)[`__scope${p}`];return{...i,...f}},{});return c.useMemo(()=>({[`__scope${n.scopeName}`]:a}),[a])}};return o.scopeName=n.scopeName,o}function Jt(e){const n=e+"CollectionProvider",[o,s]=Yt(n),[r,l]=o(n,{collectionRef:{current:null},itemMap:new Map}),a=b=>{const{scope:h,children:S}=b,E=R.useRef(null),I=R.useRef(new Map).current;return t.jsx(r,{scope:h,itemMap:I,collectionRef:E,children:S})};a.displayName=n;const i=e+"CollectionSlot",u=xe(i),p=R.forwardRef((b,h)=>{const{scope:S,children:E}=b,I=l(i,S),M=me(h,I.collectionRef);return t.jsx(u,{ref:M,children:E})});p.displayName=i;const d=e+"CollectionItemSlot",f="data-radix-collection-item",m=xe(d),j=R.forwardRef((b,h)=>{const{scope:S,children:E,...I}=b,M=R.useRef(null),_=me(h,M),w=l(d,S);return R.useEffect(()=>(w.itemMap.set(M,{ref:M,...I}),()=>void w.itemMap.delete(M))),t.jsx(m,{[f]:"",ref:_,children:E})});j.displayName=d;function v(b){const h=l(e+"CollectionConsumer",b);return R.useCallback(()=>{const E=h.collectionRef.current;if(!E)return[];const I=Array.from(E.querySelectorAll(`[${f}]`));return Array.from(h.itemMap.values()).sort((w,$)=>I.indexOf(w.ref.current)-I.indexOf($.ref.current))},[h.collectionRef,h.itemMap])}return[{Provider:a,Slot:p,ItemSlot:j},v,s]}function en(e,n=[]){let o=[];function s(l,a){const i=c.createContext(a),u=o.length;o=[...o,a];const p=f=>{const{scope:m,children:j,...v}=f,b=m?.[e]?.[u]||i,h=c.useMemo(()=>v,Object.values(v));return t.jsx(b.Provider,{value:h,children:j})};p.displayName=l+"Provider";function d(f,m){const j=m?.[e]?.[u]||i,v=c.useContext(j);if(v)return v;if(a!==void 0)return a;throw new Error(`\`${f}\` must be used within \`${l}\``)}return[p,d]}const r=()=>{const l=o.map(a=>c.createContext(a));return function(i){const u=i?.[e]||l;return c.useMemo(()=>({[`__scope${e}`]:{...i,[e]:u}}),[i,u])}};return r.scopeName=e,[s,tn(r,...n)]}function tn(...e){const n=e[0];if(e.length===1)return n;const o=()=>{const s=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(l){const a=s.reduce((i,{useScope:u,scopeName:p})=>{const f=u(l)[`__scope${p}`];return{...i,...f}},{});return c.useMemo(()=>({[`__scope${n.scopeName}`]:a}),[a])}};return o.scopeName=n.scopeName,o}var Ne=globalThis?.document?c.useLayoutEffect:()=>{},nn=Fe[" useId ".trim().toString()]||(()=>{}),on=0;function rn(e){const[n,o]=c.useState(nn());return Ne(()=>{o(s=>s??String(on++))},[e]),n?`radix-${n}`:""}function sn(e){const n=c.useRef(e);return c.useEffect(()=>{n.current=e}),c.useMemo(()=>(...o)=>n.current?.(...o),[])}var an=Fe[" useInsertionEffect ".trim().toString()]||Ne;function ie({prop:e,defaultProp:n,onChange:o=()=>{},caller:s}){const[r,l,a]=ln({defaultProp:n,onChange:o}),i=e!==void 0,u=i?e:r;{const d=c.useRef(e!==void 0);c.useEffect(()=>{const f=d.current;f!==i&&console.warn(`${s} is changing from ${f?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),d.current=i},[i,s])}const p=c.useCallback(d=>{if(i){const f=cn(d)?d(e):d;f!==e&&a.current?.(f)}else l(d)},[i,e,l,a]);return[u,p]}function ln({defaultProp:e,onChange:n}){const[o,s]=c.useState(e),r=c.useRef(o),l=c.useRef(n);return an(()=>{l.current=n},[n]),c.useEffect(()=>{r.current!==o&&(l.current?.(o),r.current=o)},[o,r]),[o,s,l]}function cn(e){return typeof e=="function"}var dn=c.createContext(void 0);function Oe(e){const n=c.useContext(dn);return e||n||"ltr"}var ue="rovingFocusGroup.onEntryFocus",un={bubbles:!1,cancelable:!0},q="RovingFocusGroup",[je,Ge,fn]=Jt(q),[pn,Ue]=en(q,[fn]),[gn,hn]=pn(q),Be=c.forwardRef((e,n)=>t.jsx(je.Provider,{scope:e.__scopeRovingFocusGroup,children:t.jsx(je.Slot,{scope:e.__scopeRovingFocusGroup,children:t.jsx(mn,{...e,ref:n})})}));Be.displayName=q;var mn=c.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:o,orientation:s,loop:r=!1,dir:l,currentTabStopId:a,defaultCurrentTabStopId:i,onCurrentTabStopIdChange:u,onEntryFocus:p,preventScrollOnEntryFocus:d=!1,...f}=e,m=c.useRef(null),j=me(n,m),v=Oe(l),[b,h]=ie({prop:a,defaultProp:i??null,onChange:u,caller:q}),[S,E]=c.useState(!1),I=sn(p),M=Ge(o),_=c.useRef(!1),[w,$]=c.useState(0);return c.useEffect(()=>{const T=m.current;if(T)return T.addEventListener(ue,I),()=>T.removeEventListener(ue,I)},[I]),t.jsx(gn,{scope:o,orientation:s,dir:v,loop:r,currentTabStopId:b,onItemFocus:c.useCallback(T=>h(T),[h]),onItemShiftTab:c.useCallback(()=>E(!0),[]),onFocusableItemAdd:c.useCallback(()=>$(T=>T+1),[]),onFocusableItemRemove:c.useCallback(()=>$(T=>T-1),[]),children:t.jsx(W.div,{tabIndex:S||w===0?-1:0,"data-orientation":s,...f,ref:j,style:{outline:"none",...e.style},onMouseDown:B(e.onMouseDown,()=>{_.current=!0}),onFocus:B(e.onFocus,T=>{const Q=!_.current;if(T.target===T.currentTarget&&Q&&!S){const V=new CustomEvent(ue,un);if(T.currentTarget.dispatchEvent(V),!V.defaultPrevented){const le=M().filter(O=>O.focusable),st=le.find(O=>O.active),at=le.find(O=>O.id===b),it=[st,at,...le].filter(Boolean).map(O=>O.ref.current);ze(it,d)}}_.current=!1}),onBlur:B(e.onBlur,()=>E(!1))})})}),Ve="RovingFocusGroupItem",He=c.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:o,focusable:s=!0,active:r=!1,tabStopId:l,children:a,...i}=e,u=rn(),p=l||u,d=hn(Ve,o),f=d.currentTabStopId===p,m=Ge(o),{onFocusableItemAdd:j,onFocusableItemRemove:v,currentTabStopId:b}=d;return c.useEffect(()=>{if(s)return j(),()=>v()},[s,j,v]),t.jsx(je.ItemSlot,{scope:o,id:p,focusable:s,active:r,children:t.jsx(W.span,{tabIndex:f?0:-1,"data-orientation":d.orientation,...i,ref:n,onMouseDown:B(e.onMouseDown,h=>{s?d.onItemFocus(p):h.preventDefault()}),onFocus:B(e.onFocus,()=>d.onItemFocus(p)),onKeyDown:B(e.onKeyDown,h=>{if(h.key==="Tab"&&h.shiftKey){d.onItemShiftTab();return}if(h.target!==h.currentTarget)return;const S=vn(h,d.orientation,d.dir);if(S!==void 0){if(h.metaKey||h.ctrlKey||h.altKey||h.shiftKey)return;h.preventDefault();let I=m().filter(M=>M.focusable).map(M=>M.ref.current);if(S==="last")I.reverse();else if(S==="prev"||S==="next"){S==="prev"&&I.reverse();const M=I.indexOf(h.currentTarget);I=d.loop?bn(I,M+1):I.slice(M+1)}setTimeout(()=>ze(I))}}),children:typeof a=="function"?a({isCurrentTabStop:f,hasTabStop:b!=null}):a})})});He.displayName=Ve;var xn={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function jn(e,n){return n!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function vn(e,n,o){const s=jn(e.key,o);if(!(n==="vertical"&&["ArrowLeft","ArrowRight"].includes(s))&&!(n==="horizontal"&&["ArrowUp","ArrowDown"].includes(s)))return xn[s]}function ze(e,n=!1){const o=document.activeElement;for(const s of e)if(s===o||(s.focus({preventScroll:n}),document.activeElement!==o))return}function bn(e,n){return e.map((o,s)=>e[(n+s)%e.length])}var Cn=Be,yn=He,We="Toggle",qe=c.forwardRef((e,n)=>{const{pressed:o,defaultPressed:s,onPressedChange:r,...l}=e,[a,i]=ie({prop:o,onChange:r,defaultProp:s??!1,caller:We});return t.jsx(W.button,{type:"button","aria-pressed":a,"data-state":a?"on":"off","data-disabled":e.disabled?"":void 0,...l,ref:n,onClick:B(e.onClick,()=>{e.disabled||i(!a)})})});qe.displayName=We;var N="ToggleGroup",[Ke]=Vt(N,[Ue]),Qe=Ue(),Ce=R.forwardRef((e,n)=>{const{type:o,...s}=e;if(o==="single"){const r=s;return t.jsx(In,{...r,ref:n})}if(o==="multiple"){const r=s;return t.jsx(wn,{...r,ref:n})}throw new Error(`Missing prop \`type\` expected on \`${N}\``)});Ce.displayName=N;var[Ze,Ye]=Ke(N),In=R.forwardRef((e,n)=>{const{value:o,defaultValue:s,onValueChange:r=()=>{},...l}=e,[a,i]=ie({prop:o,defaultProp:s??"",onChange:r,caller:N});return t.jsx(Ze,{scope:e.__scopeToggleGroup,type:"single",value:R.useMemo(()=>a?[a]:[],[a]),onItemActivate:i,onItemDeactivate:R.useCallback(()=>i(""),[i]),children:t.jsx(Xe,{...l,ref:n})})}),wn=R.forwardRef((e,n)=>{const{value:o,defaultValue:s,onValueChange:r=()=>{},...l}=e,[a,i]=ie({prop:o,defaultProp:s??[],onChange:r,caller:N}),u=R.useCallback(d=>i((f=[])=>[...f,d]),[i]),p=R.useCallback(d=>i((f=[])=>f.filter(m=>m!==d)),[i]);return t.jsx(Ze,{scope:e.__scopeToggleGroup,type:"multiple",value:a,onItemActivate:u,onItemDeactivate:p,children:t.jsx(Xe,{...l,ref:n})})});Ce.displayName=N;var[Sn,Mn]=Ke(N),Xe=R.forwardRef((e,n)=>{const{__scopeToggleGroup:o,disabled:s=!1,rovingFocus:r=!0,orientation:l,dir:a,loop:i=!0,...u}=e,p=Qe(o),d=Oe(a),f={role:"group",dir:d,...u};return t.jsx(Sn,{scope:o,rovingFocus:r,disabled:s,children:r?t.jsx(Cn,{asChild:!0,...p,orientation:l,dir:d,loop:i,children:t.jsx(W.div,{...f,ref:n})}):t.jsx(W.div,{...f,ref:n})})}),oe="ToggleGroupItem",Je=R.forwardRef((e,n)=>{const o=Ye(oe,e.__scopeToggleGroup),s=Mn(oe,e.__scopeToggleGroup),r=Qe(e.__scopeToggleGroup),l=o.value.includes(e.value),a=s.disabled||e.disabled,i={...e,pressed:l,disabled:a},u=R.useRef(null);return s.rovingFocus?t.jsx(yn,{asChild:!0,...r,focusable:!a,active:l,ref:u,children:t.jsx(Me,{...i,ref:n})}):t.jsx(Me,{...i,ref:n})});Je.displayName=oe;var Me=R.forwardRef((e,n)=>{const{__scopeToggleGroup:o,value:s,...r}=e,l=Ye(oe,o),a={role:"radio","aria-checked":e.pressed,"aria-pressed":void 0},i=l.type==="single"?a:void 0;return t.jsx(qe,{...i,...r,ref:n,onPressedChange:u=>{u?l.onItemActivate(s):l.onItemDeactivate(s)}})}),Rn=Ce,Dn=Je;const Tn=Ae.injectEndpoints({endpoints:e=>({getFolders:e.query({query:(n={})=>{const{parentId:o}=n,s={};return o!=null?s.filters={$and:[{parent:{id:o}}]}:s.filters={$and:[{parent:{id:{$null:!0}}}]},{url:"/upload/folders",method:"GET",config:{params:s}}},transformResponse:n=>n.data,providesTags:n=>n?[...n.map(({id:o})=>({type:"Folder",id:o})),{type:"Folder",id:"LIST"}]:[{type:"Folder",id:"LIST"}]}),createFolder:e.mutation({query:n=>({url:"/upload/folders",method:"POST",data:n}),transformResponse:n=>n.data,invalidatesTags:[{type:"Folder",id:"LIST"}]}),getFolder:e.query({query:({id:n})=>({url:`/upload/folders/${n}`,method:"GET",config:{params:{populate:{parent:{populate:{parent:"*"}},children:{count:!0},files:{count:!0}}}}}),transformResponse:n=>n.data,providesTags:(n,o,{id:s})=>[{type:"Folder",id:s}]})})}),{useCreateFolderMutation:En,useGetFoldersQuery:Fn,useGetFolderQuery:An}=Tn;var k=function(e){return e.Video="video",e.Image="image",e.Document="doc",e.Audio="audio",e}({});const $n=Ae.injectEndpoints({endpoints:e=>({getAssets:e.query({query:(n={})=>{const{folder:o,...s}=n,r={...s};return o!=null?r.filters={$and:[{folder:{id:o}}]}:r.filters={$and:[{folder:{id:{$null:!0}}}]},{url:"/upload/files",method:"GET",config:{params:r}}},transformResponse:n=>n,providesTags:n=>n?[...n.results.map(({id:o})=>({type:"Asset",id:o})),{type:"Asset",id:"LIST"}]:[{type:"Asset",id:"LIST"}]}),getAsset:e.query({query:n=>({url:`/upload/files/${n}`,method:"GET"}),providesTags:(n,o,s)=>[{type:"Asset",id:s}]})})}),{useGetAssetsQuery:et,useGetAssetQuery:Pn}=$n,Ln={pdf:gt,csv:pt,xls:ft,zip:ut},K=(e,n)=>{const o=$e(n);return e?.includes(k.Image)?lt:e?.includes(k.Video)?ct:e?.includes(k.Audio)?dt:o?Ln[o]||Ie:Ie},H=x(F)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 24rem;
  overflow: hidden;
  border-radius: ${({theme:e})=>e.borderRadius};
  padding: ${({theme:e})=>e.spaces[3]};
  background: repeating-conic-gradient(
      ${({theme:e})=>e.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;
`,Y=x(C)`
  justify-content: center;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
`,_n=x.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`,kn=x.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`,Nn=x.audio`
  width: 100%;
`,On=x.iframe`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: none;
`,Gn=x(C)`
  height: 100%;
  aspect-ratio: 1;
  width: auto;
  max-width: 100%;
  margin: 0 auto;
  color: ${({theme:e})=>e.colors.neutral500};
  background: ${({theme:e})=>e.colors.neutral150};
`,Un=x(C)`
  position: absolute;
  inset: 0;
  z-index: 1;
`,X=()=>{const{formatMessage:e}=D();return t.jsx(Un,{justifyContent:"center",alignItems:"center",children:t.jsx(te,{children:e({id:"app.loading",defaultMessage:"Loading..."})})})},Bn=({asset:e})=>{const{formatMessage:n}=D(),{alternativeText:o,ext:s,mime:r,url:l}=e,a=ee(l),[i,u]=c.useState(!1);if(c.useEffect(()=>{u(!1)},[a]),r?.includes(k.Image)){const f=ee(l);if(f)return t.jsxs(H,{children:[!i&&t.jsx(X,{}),t.jsx(Y,{children:t.jsx(_n,{src:f,alt:o||e.name||"",onLoad:()=>u(!0),onError:()=>u(!0)})})]})}if(r?.includes(k.Video)&&a)return t.jsxs(H,{children:[!i&&t.jsx(X,{}),t.jsx(Y,{children:t.jsx(kn,{src:a,controls:!0,title:e.name,onLoadedData:()=>u(!0),onError:()=>u(!0),children:n({id:g("asset-details.videoNotSupported"),defaultMessage:"Your browser does not support the video tag."})})})]});if(r?.includes(k.Audio)&&a)return t.jsxs(H,{children:[!i&&t.jsx(X,{}),t.jsx(Y,{children:t.jsx(C,{width:"100%",padding:4,justifyContent:"center",alignItems:"center",height:"100%",minHeight:"12rem",children:t.jsx(Nn,{src:a,controls:!0,onLoadedData:()=>u(!0),onError:()=>u(!0)})})})]});if((s?.toLowerCase()==="pdf"||s?.toLowerCase()===".pdf"||r==="application/pdf")&&a)return t.jsxs(H,{children:[!i&&t.jsx(X,{}),t.jsx(Y,{children:t.jsx(On,{src:`${a}#toolbar=0`,title:e.name,onLoad:()=>u(!0)})})]});const d=K(r,s);return t.jsx(H,{children:t.jsxs(Gn,{justifyContent:"center",alignItems:"center",gap:1,direction:"column",hasRadius:!0,children:[t.jsx(d,{width:24,height:24}),t.jsx(y,{variant:"pi",children:n({id:g("asset-details.noPreview"),defaultMessage:"No preview available"})})]})})},fe="assetId",tt=()=>{const[{query:e},n]=Pe(),o=e?.[fe],s=o?parseInt(o,10):null,r=s!==null&&!Number.isNaN(s),[l,a]=c.useState(!1),i=c.useRef(null),u=r&&!l;c.useEffect(()=>{r&&(i.current=s)},[r,s]);const p=c.useCallback(j=>{a(!1),n({[fe]:String(j)})},[n]),d=c.useCallback(()=>{r&&a(!0)},[r]);c.useEffect(()=>{if(!l)return;const j=window.setTimeout(()=>{n({[fe]:void 0},"remove"),a(!1),i.current=null},ht);return()=>window.clearTimeout(j)},[l,n]);const f=r||l;return{assetId:l?i.current??s:s,isVisible:u,shouldRenderDrawer:f,openDetails:p,closeDetails:d}},Vn=x(C)`
  flex: 0 0 calc(50% - ${({theme:e})=>e.spaces[2]});
`,G=({label:e,value:n})=>t.jsxs(Vn,{direction:"column",justifyContent:"flex-start",alignItems:"flex-start",gap:1,children:[t.jsx(y,{variant:"sigma",textColor:"neutral600",fontWeight:"semiBold",textTransform:"uppercase",children:e}),t.jsx(y,{variant:"pi",textColor:"neutral700",children:n??"-"})]}),Hn=x(vt)`
  width: 1.6rem;
  height: 1.6rem;

  path {
    fill: ${({theme:e})=>e.colors.warning500};
  }
`,pe=({name:e,label:n,value:o,required:s})=>t.jsxs(L.Root,{name:e,required:s,children:[t.jsx(L.Label,{children:n}),t.jsx(Le,{value:o??"",onChange:()=>{},endAction:o?void 0:t.jsx(Hn,{}),type:"text"})]}),zn=({asset:e})=>{const{formatMessage:n,formatDate:o}=D(),s=e.mime?.includes(k.Image);return t.jsxs(C,{direction:"column",alignItems:"stretch",gap:4,paddingTop:4,paddingBottom:4,paddingLeft:5,paddingRight:5,children:[t.jsx(y,{variant:"beta",fontWeight:"semiBold",tag:"h3",children:n({id:g("asset-details.fileInfo"),defaultMessage:"File info"})}),t.jsxs(C,{wrap:"wrap",gap:4,background:"neutral100",paddingTop:4,paddingBottom:4,paddingLeft:6,paddingRight:6,alignItems:"flex-start",children:[t.jsx(G,{label:n({id:g("asset-details.creationDate"),defaultMessage:"Creation date"}),value:e.createdAt?o(new Date(e.createdAt),{dateStyle:"long",timeStyle:"short"}):null}),t.jsx(G,{label:n({id:g("asset-details.lastUpdated"),defaultMessage:"Last updated"}),value:e.updatedAt?o(new Date(e.updatedAt),{dateStyle:"long",timeStyle:"short"}):null}),t.jsx(G,{label:n({id:g("asset-details.createdBy"),defaultMessage:"Created by"}),value:e.createdBy?Bt({firstname:e.createdBy.firstname??void 0,lastname:e.createdBy.lastname??void 0,username:e.createdBy.username??void 0,email:e.createdBy.email??void 0})??"-":null}),t.jsx(G,{label:n({id:g("asset-details.size"),defaultMessage:"Size"}),value:e.size?ge(e.size,1):null}),s&&(e.width!=null||e.height!=null)&&t.jsx(G,{label:n({id:g("asset-details.dimensions"),defaultMessage:"Dimensions"}),value:e.width!=null&&e.height!=null?`${e.width} × ${e.height}`:null}),t.jsx(G,{label:n({id:g("asset-details.extension"),defaultMessage:"Extension"}),value:$e(e.ext)}),t.jsx(G,{label:n({id:g("asset-details.assetId"),defaultMessage:"Asset ID"}),value:String(e.id)})]}),t.jsx(pe,{name:"fileName",label:n({id:g("asset-details.fileName"),defaultMessage:"File name"}),value:e.name,required:!0}),s&&t.jsxs(t.Fragment,{children:[t.jsx(pe,{name:"caption",label:n({id:g("asset-details.caption"),defaultMessage:"Caption"}),value:e.caption}),t.jsx(pe,{name:"alternativeText",label:n({id:g("asset-details.alternativeText"),defaultMessage:"Alternative text"}),value:e.alternativeText})]})]})},Wn=({asset:e,closeDetails:n})=>{const o=e?K(e.mime,e.ext):xt;return t.jsxs(C,{gap:2,paddingLeft:5,paddingTop:3,paddingBottom:3,paddingRight:3,children:[t.jsx(o,{width:20,height:20}),t.jsx(U.Title,{asChild:!0,children:t.jsx(y,{variant:"omega",fontWeight:"semiBold",overflow:"hidden",ellipsis:!0,tag:"h2",children:e.name})}),t.jsx(F,{marginLeft:"auto",children:t.jsx(U.CloseButton,{onClose:n,children:t.jsx(jt,{})})})]})},qn=({assetId:e,closeDetails:n})=>{const{formatMessage:o}=D(),{data:s,isLoading:r,error:l}=Pn(e,{refetchOnMountOrArgChange:!1,refetchOnReconnect:!1,refetchOnFocus:!1});return r?t.jsx(C,{justifyContent:"center",padding:8,children:t.jsx(te,{children:o({id:"app.loading",defaultMessage:"Loading..."})})}):l||!s?t.jsx(C,{direction:"column",alignItems:"stretch",gap:4,padding:4,children:t.jsx(mt,{variant:"danger",closeLabel:o({id:"global.close",defaultMessage:"Close"}),onClose:n,children:o({id:g("asset-details.error"),defaultMessage:"Failed to load file details."})})}):t.jsxs(t.Fragment,{children:[t.jsx(Wn,{asset:s,closeDetails:n}),t.jsxs(U.ScrollableContent,{children:[t.jsx(Bn,{asset:s}),t.jsx(zn,{asset:s})]})]})},Kn=()=>{const{formatMessage:e}=D(),{assetId:n,isVisible:o,shouldRenderDrawer:s,closeDetails:r}=tt();return!s||n===null?null:t.jsxs(U.Root,{isVisible:o,onClose:r,children:[t.jsx("div",{children:t.jsxs(ve,{children:[t.jsx(U.Title,{children:e({id:g("asset-details.title"),defaultMessage:"File details"})}),t.jsx(U.Description,{children:e({id:g("asset-details.description"),defaultMessage:"Displays file information and metadata"})})]})}),t.jsx(U.Body,{animationDirection:"left",width:"41.6rem",height:"100vh",children:t.jsx(qn,{assetId:n,closeDetails:r})})]})},ye=()=>{const[{query:e},n]=Pe();return{currentFolderId:e?.folder?Number(e.folder):null,navigateToFolder:r=>{n({folder:String(r.id)})}}},Qn=x(Ct)`
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: 2px;
  }
`,Zn=x(F)`
  grid-column: 1 / -1;
`,Yn=x(C)`
  width: 100%;
  padding: ${({theme:e})=>`${e.spaces[2]} ${e.spaces[3]}`}; // 8px 12px
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]}; // 8px
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  background: ${({theme:e})=>e.colors.neutral0};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: 2px;
  }
`,Xn=x(C)`
  flex-shrink: 0;
  color: ${({theme:e})=>e.colors.neutral600};
`,Jn=x(y)`
  flex: 1;
  min-width: 0;
`,eo=({folder:e})=>{const{formatMessage:n}=D(),{navigateToFolder:o}=ye(),s=r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o(e))};return t.jsxs(Yn,{onClick:()=>o(e),onKeyDown:s,role:"listitem",tabIndex:0,children:[t.jsx(Xn,{children:t.jsx(re,{width:20,height:20})}),t.jsx(Jn,{textColor:"neutral800",ellipsis:!0,children:e.name}),t.jsx(se,{label:n({id:g("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:r=>r.stopPropagation(),children:t.jsx(ae,{})})]})},Re=x(F)`
  position: relative;
  width: 100%;
  padding-bottom: 62.5%;
  height: 0;
  overflow: hidden;
  background: repeating-conic-gradient(
      ${({theme:e})=>e.colors.neutral100} 0% 25%,
      transparent 0% 50%
    )
    50% / 20px 20px;
`,to=x.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`,no=x(C)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${({theme:e})=>e.colors.neutral500};
  background: ${({theme:e})=>e.colors.neutral100};
`,oo=({asset:e})=>{const{alternativeText:n,ext:o,formats:s,mime:r,url:l}=e;if(r?.includes(k.Image)){const i=ee(s?.thumbnail?.url)??ee(l);if(i)return t.jsx(Re,{children:t.jsx(to,{src:i,alt:n||""})})}const a=K(r,o);return t.jsx(Re,{children:t.jsx(no,{justifyContent:"center",alignItems:"center",children:t.jsx(a,{width:48,height:48})})})},ro=x(yt)`
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral200};
`,so=x(C)`
  min-width: 0;
  width: 100%;
`,ao=x(C)`
  color: ${({theme:e})=>e.colors.neutral600};
  flex-shrink: 0;
`,io=x(y)`
  flex: 1;
  min-width: 0;
`,lo=({asset:e,onAssetItemClick:n})=>{const{formatMessage:o}=D(),s=K(e.mime,e.ext),r=l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),n(e.id))};return t.jsxs(Qn,{tabIndex:0,role:"listitem",onClick:()=>n(e.id),onKeyDown:r,children:[t.jsx(ro,{children:t.jsx(oo,{asset:e})}),t.jsx(bt,{children:t.jsxs(so,{alignItems:"center",gap:2,children:[t.jsx(ao,{children:t.jsx(s,{width:20,height:20})}),t.jsx(io,{textColor:"primary800",ellipsis:!0,children:e.name}),t.jsx(se,{label:o({id:g("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",children:t.jsx(ae,{})})]})})]})},co=({assets:e,folders:n=[],onAssetItemClick:o})=>{const{formatMessage:s}=D();return n.length+e.length===0?t.jsx(F,{padding:8,children:t.jsx(y,{textColor:"neutral600",children:s({id:"app.components.EmptyStateLayout.content-document",defaultMessage:"No content found"})})}):t.jsxs(Z.Root,{gap:4,role:"list",children:[n.length>0&&t.jsx(Zn,{children:t.jsx(Z.Root,{gap:4,children:n.map(l=>t.jsx(Z.Item,{col:3,m:4,s:6,xs:12,children:t.jsx(eo,{folder:l})},`folder-${l.id}`))})}),e.map(l=>t.jsx(Z.Item,{col:3,m:4,s:6,xs:12,direction:"column",alignItems:"stretch",children:t.jsx(lo,{asset:l,onAssetItemClick:o})},l.id))]})},uo={view:"STRAPI_UPLOAD_LIBRARY_VIEW"},z={GRID:0,TABLE:1},De=[{name:"name",label:{id:g("list.table.header.name"),defaultMessage:"name"}},{name:"createdAt",label:{id:g("list.table.header.creationDate"),defaultMessage:"creation date"}},{name:"updatedAt",label:{id:g("list.table.header.lastModified"),defaultMessage:"last modified"}},{name:"size",label:{id:g("list.table.header.size"),defaultMessage:"size"}},{name:"actions",label:{id:g("list.table.header.actions"),defaultMessage:"actions"},isVisuallyHidden:!0}],fo=x(wt)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid ${({theme:e})=>e.colors.neutral150};
  border-radius: 4px;
  overflow: hidden;
`,po=x(St)`
  background: ${({theme:e})=>e.colors.neutral100};

  tr {
    border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
  }
`,Te=x(Mt)`
  height: 40px;
  padding: 0 ${({theme:e})=>e.spaces[4]};
  text-align: left;
`,P=x(_e)`
  padding: 0 ${({theme:e})=>e.spaces[4]};
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`,nt=x(he)`
  height: 48px;
  background: ${({theme:e})=>e.colors.neutral0};
  cursor: pointer;

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &:focus-visible {
    outline: 2px solid ${({theme:e})=>e.colors.primary600};
    outline-offset: -2px;
  }

  &:last-child {
    ${P} {
      border-bottom: 0;
    }
  }
`,go=x(_e)`
  padding: ${({theme:e})=>e.spaces[4]};
  border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};
`,ho=({asset:e})=>{const{ext:n,mime:o}=e,s=K(o,n);return t.jsx(C,{justifyContent:"center",alignItems:"center",borderRadius:"4px",color:"neutral500",width:"3.2rem",height:"3.2rem",shrink:0,children:t.jsx(s,{width:20,height:20})})},mo=({asset:e,onAssetItemClick:n})=>{const o=be(),{formatDate:s,formatMessage:r}=D(),l=a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),n(e.id))};return t.jsxs(nt,{tabIndex:0,role:"row",onClick:()=>n(e.id),onKeyDown:l,children:[t.jsx(P,{children:t.jsxs(C,{gap:3,alignItems:"center",children:[t.jsx(ho,{asset:e}),t.jsxs(C,{direction:"column",alignItems:"flex-start",children:[t.jsx(y,{textColor:"neutral800",fontWeight:"semiBold",ellipsis:!0,children:e.name}),o&&t.jsx(y,{textColor:"neutral600",variant:"pi",children:e.size?ge(e.size,1):"-"})]})]})}),!o&&t.jsxs(t.Fragment,{children:[t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:e.createdAt?s(new Date(e.createdAt),{dateStyle:"long"}):"-"})}),t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:e.updatedAt?s(new Date(e.updatedAt),{dateStyle:"long"}):"-"})}),t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:e.size?ge(e.size,1):"-"})})]}),t.jsx(P,{children:t.jsx(C,{justifyContent:"flex-end",children:t.jsx(se,{label:r({id:g("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",children:t.jsx(ae,{})})})})]})},xo=x(nt)`
  cursor: pointer;

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }
`,jo=({folder:e})=>{const n=be(),{formatDate:o,formatMessage:s}=D(),{navigateToFolder:r}=ye(),l=a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r(e))};return t.jsxs(xo,{tabIndex:0,role:"row",onClick:()=>r(e),onKeyDown:l,children:[t.jsx(P,{children:t.jsxs(C,{gap:3,alignItems:"center",children:[t.jsx(C,{justifyContent:"center",alignItems:"center",borderRadius:"4px",color:"neutral600",width:"3.2rem",height:"3.2rem",shrink:0,children:t.jsx(re,{width:20,height:20})}),t.jsx(y,{textColor:"neutral800",fontWeight:"semiBold",ellipsis:!0,children:e.name})]})}),!n&&t.jsxs(t.Fragment,{children:[t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:e.createdAt?o(new Date(e.createdAt),{dateStyle:"long"}):"-"})}),t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:e.updatedAt?o(new Date(e.updatedAt),{dateStyle:"long"}):"-"})}),t.jsx(P,{children:t.jsx(y,{textColor:"neutral600",children:"-"})})]}),t.jsx(P,{children:t.jsx(C,{justifyContent:"flex-end",children:t.jsx(se,{label:s({id:g("control-card.more-actions"),defaultMessage:"More actions"}),variant:"ghost",onClick:a=>a.stopPropagation(),children:t.jsx(ae,{})})})})]})},vo=({assets:e,folders:n=[],onAssetItemClick:o})=>{const s=be(),{formatMessage:r}=D(),l=s?De.filter(i=>i.name==="name"||i.name==="actions"):De,a=n.length+e.length;return t.jsxs(fo,{colCount:l.length,rowCount:a+1,children:[t.jsx(po,{children:t.jsx(he,{children:l.map(i=>{const u=r(i.label);return"isVisuallyHidden"in i&&i.isVisuallyHidden?t.jsx(Te,{children:t.jsx(ve,{children:r({id:g("table.header.actions"),defaultMessage:"actions"})})},i.name):t.jsx(Te,{children:t.jsx(y,{textColor:"neutral600",variant:"sigma",children:u})},i.name)})})}),t.jsx(It,{children:a===0?t.jsx(he,{children:t.jsx(go,{colSpan:l.length,children:t.jsx(y,{textColor:"neutral600",children:r({id:"app.components.EmptyStateLayout.content-document",defaultMessage:"No content found"})})})}):t.jsxs(t.Fragment,{children:[n.map(i=>t.jsx(jo,{folder:i},`folder-${i.id}`)),e.map(i=>t.jsx(mo,{asset:i,onAssetItemClick:o},i.id))]})})]})},bo=x(A.Content)`
  max-width: 51.6rem;
`,Co=({open:e,folderName:n,parentFolderId:o,onClose:s})=>{const{formatMessage:r}=D(),{toggleNotification:l}=Rt(),[a,i]=c.useState(""),[u,p]=c.useState(),[d,{isLoading:f}]=En();c.useEffect(()=>{e&&(i(""),p(void 0))},[e]);const m=async j=>{j.preventDefault();const v=a.trim();if(!v){p(r({id:g("folder.create.form.error.name-required"),defaultMessage:"Name is required"}));return}try{await d({name:v,parent:o}).unwrap(),l({type:"success",message:r({id:g("folder.create.success"),defaultMessage:"Folder has been created"})}),s()}catch(b){const h=b;h?.message?p(h.message):l({type:"danger",message:r({id:g("folder.create.form.error.unknown"),defaultMessage:"An error occurred while creating the folder"})})}};return t.jsx(A.Root,{open:e,onOpenChange:s,children:t.jsxs(bo,{children:[t.jsx(A.Header,{children:t.jsx(A.Title,{children:r({id:g("folder.create.title-in"),defaultMessage:"New folder in {folderName}"},{folderName:n})})}),t.jsxs("form",{onSubmit:m,children:[t.jsx(A.Body,{children:t.jsxs(L.Root,{error:u,name:"name",required:!0,children:[t.jsx(L.Label,{children:r({id:g("folder.form.name.label"),defaultMessage:"Folder name"})}),t.jsx(Le,{value:a,onChange:j=>{i(j.target.value),p(void 0)},autoFocus:!0}),t.jsx(L.Error,{})]})}),t.jsx(A.Footer,{children:t.jsxs(C,{gap:2,justifyContent:"space-between",width:"100%",children:[t.jsx(ne,{variant:"tertiary",onClick:s,type:"button",children:r({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),t.jsx(ne,{type:"submit",loading:f,children:r({id:g("folder.create.submit"),defaultMessage:"Create folder"})})]})})]})]})})},ot=c.createContext(null),yo=x(F)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
`,Io=({children:e,onDrop:n})=>{const[o,s]=c.useState(!1),r=c.useRef(0),l={isDragging:o};c.useEffect(()=>{const d=()=>{s(!1),r.current=0},f=m=>{m.relatedTarget||(s(!1),r.current=0)};return document.addEventListener("dragend",d),document.addEventListener("dragleave",f),()=>{document.removeEventListener("dragend",d),document.removeEventListener("dragleave",f)}},[]);const a=c.useCallback(d=>{d.preventDefault(),d.stopPropagation(),r.current+=1,d.dataTransfer.types.includes("Files")&&s(!0)},[]),i=c.useCallback(d=>{d.preventDefault(),d.stopPropagation(),r.current-=1,r.current<=0&&(s(!1),r.current=0)},[]),u=c.useCallback(d=>{d.preventDefault(),d.stopPropagation(),d.dataTransfer.dropEffect="copy"},[]),p=c.useCallback(d=>{d.preventDefault(),d.stopPropagation(),s(!1),r.current=0;const{files:f}=d.dataTransfer;f?.length&&n&&n(Array.from(f))},[n]);return t.jsx(ot.Provider,{value:l,children:t.jsx(yo,{"data-testid":"assets-dropzone",onDragEnter:a,onDragLeave:i,onDragOver:u,onDrop:p,children:e})})},rt=()=>{const e=c.useContext(ot);if(!e)throw new Error("useUploadDropZone must be used within UploadDropZone");return{isDragging:e.isDragging}},wo=(e,n)=>`${e}${Math.floor(n*255).toString(16).padStart(2,"0")}`,So=x(F)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({theme:e})=>wo(e.colors.primary200,.3)};
  border: 1px solid ${({theme:e})=>e.colors.primary700};
  border-radius: ${({theme:e})=>e.borderRadius};
  z-index: 1;
  pointer-events: none;
`,Mo=({children:e})=>{const{isDragging:n}=rt();return t.jsxs(F,{position:"relative",children:[n&&t.jsx(So,{}),e]})},Ro=x(F)`
  position: fixed;
  bottom: ${({theme:e})=>e.spaces[8]};
  left: 50%;
  transform: translateX(calc(-50% + ${({$leftContentWidth:e})=>e/2}px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({theme:e})=>e.spaces[2]};
  background: ${({theme:e})=>e.colors.primary600};
  padding: ${({theme:e})=>e.spaces[4]} ${({theme:e})=>e.spaces[6]};
  border-radius: ${({theme:e})=>e.borderRadius};
  z-index: 2;
`,Do=({uploadDropZoneRef:e,folderName:n})=>{const{formatMessage:o}=D(),{isDragging:s}=rt(),[r,l]=c.useState(0);return c.useEffect(()=>{if(!e?.current)return;const a=()=>{const u=e.current?.getBoundingClientRect();u&&l(p=>p!==u.left?u.left:p)};a();const i=new ResizeObserver(a);return i.observe(e.current),()=>i.disconnect()},[e]),s?t.jsxs(Ro,{$leftContentWidth:r,children:[t.jsx(y,{textColor:"neutral0",children:o({id:g("dropzone.upload.message"),defaultMessage:"Drop here to upload to"})}),t.jsxs(C,{gap:2,alignItems:"center",children:[t.jsx(re,{width:20,height:20,fill:"neutral0"}),t.jsx(y,{textColor:"neutral0",fontWeight:"semiBold",children:n})]})]}):null},To=({open:e,onClose:n,onUpload:o})=>{const{formatMessage:s}=D(),[r,l]=c.useState(""),[a,i]=c.useState(null),u=()=>{l(""),i(null),n()},p=async d=>{d.preventDefault();const{urls:f,error:m}=Tt(r);if(m){i(m);return}i(null),u(),await o(f)};return t.jsx(A.Root,{open:e,onOpenChange:d=>!d&&u(),children:t.jsx(A.Content,{children:t.jsxs("form",{onSubmit:p,children:[t.jsx(A.Header,{children:t.jsx(A.Title,{children:s({id:g("modal.url.title"),defaultMessage:"Import from URL"})})}),t.jsx(A.Body,{children:t.jsxs(L.Root,{error:a||void 0,hint:s({id:g("input.url.description"),defaultMessage:"Separate your URL links by a carriage return."}),children:[t.jsx(L.Label,{children:s({id:g("input.url.label"),defaultMessage:"URL(s)"})}),t.jsx(Dt,{name:"urls",minHeight:"unset",rows:Math.min(r.split(`
`).length,7),maxHeight:"10.5rem",placeholder:s({id:g("input.url.placeholder"),defaultMessage:"Empty"}),value:r,onChange:d=>{l(d.target.value),i(null)}}),t.jsx(L.Hint,{}),t.jsx(L.Error,{})]})}),t.jsxs(A.Footer,{children:[t.jsx(ne,{variant:"tertiary",onClick:u,children:s({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),t.jsx(ne,{type:"submit",children:s({id:g("modal.url.upload"),defaultMessage:"Upload"})})]})]})})})},Eo=e=>{const{formatMessage:n}=D(),{data:o,isLoading:s}=An({id:e},{skip:e===null}),{data:r,isLoading:l}=et({folder:null,pageSize:1},{skip:e!==null}),a=n({id:g("plugin.home"),defaultMessage:"Home"});return e===null?l?{title:a,itemCount:0}:{title:a,itemCount:r?.pagination?.total??0}:s?{title:a,itemCount:0}:{title:o?.name??a,itemCount:o?.files?.count??0}},J=20,Fo=({folder:e=null,sort:n}={})=>{const[o,s]=c.useState(1),r=c.useRef([]),l=c.useRef(!0),{currentData:a,isLoading:i,isFetching:u,error:p}=et({folder:e,page:o,pageSize:J,sort:n}),d=a?.pagination,f=c.useMemo(()=>{if(!a)return r.current;const b=a.results;if(o===1)r.current=b;else{const h=(o-1)*J;if(r.current.length<h-J)return r.current;r.current.length<o*J&&(r.current=[...r.current,...b])}return r.current},[a,o]);c.useEffect(()=>{if(l.current){l.current=!1;return}s(1),r.current=[]},[e,n]);const m=d?o<d.pageCount:!1,j=u&&o>1,v=c.useCallback(()=>{s(b=>b+1)},[]);return{assets:f,pagination:d,isLoading:i,isFetchingMore:j,hasNextPage:m,fetchNextPage:v,error:p}},Ao={threshold:.1},$o=({view:e,folderId:n,onAssetItemClick:o})=>{const{formatMessage:s}=D(),{assets:r,isLoading:l,isFetchingMore:a,hasNextPage:i,fetchNextPage:u,error:p}=Fo({folder:n}),{data:d=[],isLoading:f}=Fn({parentId:n}),m=e===z.GRID,j=l||f,v=Ot(c.useCallback(b=>{b&&i&&!a&&u()},[i,a,u]),Ao);return j?t.jsx(C,{justifyContent:"center",padding:8,children:t.jsx(te,{children:s({id:"app.loading",defaultMessage:"Loading..."})})}):p?t.jsx(F,{padding:8,children:t.jsx(y,{textColor:"danger600",children:s({id:g("list.assets.error"),defaultMessage:"An error occurred while fetching assets."})})}):d.length===0&&r.length===0?t.jsx(F,{padding:8,children:t.jsx(y,{textColor:"neutral600",children:s({id:"app.components.EmptyStateLayout.content-document",defaultMessage:"No content found"})})}):t.jsxs(t.Fragment,{children:[m?t.jsx(co,{folders:d,assets:r,onAssetItemClick:o}):t.jsx(vo,{assets:r,folders:d,onAssetItemClick:o}),t.jsx("div",{ref:v,style:{height:1}}),a&&t.jsx(C,{justifyContent:"center",padding:4,children:t.jsx(te,{children:s({id:g("list.assets.loading-more"),defaultMessage:"Loading more assets..."})})})]})},Po=x(Rn)`
  display: flex;
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  border-radius: ${({theme:e})=>e.borderRadius};
  overflow: hidden;
`,Ee=x(Dn)`
  display: flex;
  align-items: center;
  gap: ${({theme:e})=>e.spaces[2]};
  padding: ${({theme:e})=>`${e.spaces[2]} ${e.spaces[4]}`};
  border: none;
  background: ${({theme:e})=>e.colors.neutral0};
  color: ${({theme:e})=>e.colors.neutral800};
  cursor: pointer;
  font-size: ${({theme:e})=>e.fontSizes[1]};
  font-weight: ${({theme:e})=>e.fontWeights.semiBold};

  &:hover {
    background: ${({theme:e})=>e.colors.primary100};
  }

  &[data-state='on'] {
    background: ${({theme:e})=>e.colors.neutral150};
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`,Lo=x(F)`
  [data-strapi-header] {
    background: ${({theme:e})=>e.colors.neutral0};

    h1 {
      font-size: 1.8rem;
    }
  }
`,_o=()=>{const{formatMessage:e}=D(),{openDetails:n}=tt(),{currentFolderId:o}=ye(),{title:s,itemCount:r}=Eo(o),l=e({id:g("header.content.item-count"),defaultMessage:"{count, plural, =1 {# item} other {# items}}"},{count:r}),[a,i]=c.useState(!1),[u,p]=Et(uo.view,z.GRID),d=u===z.GRID,[f,m]=c.useState(!1),j=c.useRef(null),v=c.useRef(null),[b]=Ft(),[h]=At(),S=async(w,$)=>{if(w.length===0)return;const T=new FormData,Q=[];w.forEach(V=>{T.append("files",V),Q.push({name:V.name,caption:null,alternativeText:null,folder:$})}),T.append("fileInfo",JSON.stringify(Q));try{await b({formData:T,totalFiles:w.length}).unwrap()}catch{}},E=()=>{j.current?.click()},I=async w=>{const $=w.target.files;$&&$.length>0&&await S(Array.from($),o),w.target.value=""},M=async w=>{await S(w,o)},_=async w=>{try{await h({urls:w,folderId:o}).unwrap()}catch{}};return t.jsxs(t.Fragment,{children:[t.jsx(Io,{onDrop:M,children:t.jsx(F,{ref:v,children:t.jsxs(ce.Root,{minHeight:"100vh",background:"neutral0",children:[t.jsx(ve,{children:t.jsx("input",{type:"file",ref:j,onChange:I,multiple:!0})}),t.jsx(Lo,{children:t.jsx(ce.Header,{title:`${s} (${l})`,primaryAction:t.jsxs(Lt,{popoverPlacement:"bottom-end",variant:"default",endIcon:t.jsx(Nt,{}),label:e({id:g("new"),defaultMessage:"New"}),children:[t.jsx(de,{onSelect:()=>i(!0),startIcon:t.jsx(re,{}),children:e({id:g("folder.create.title"),defaultMessage:"New folder"})}),t.jsx(de,{onSelect:E,startIcon:t.jsx(_t,{}),children:e({id:g("import-files"),defaultMessage:"Import files"})}),t.jsx(de,{onSelect:()=>m(!0),startIcon:t.jsx(kt,{}),children:e({id:g("import-from-url"),defaultMessage:"Import from URL"})})]}),subtitle:t.jsxs(C,{justifyContent:"space-between",alignItems:"center",gap:4,width:"100%",children:[t.jsx(C,{gap:4,alignItems:"center",children:"TODO: Filters and search"}),t.jsxs(C,{gap:4,alignItems:"center",children:[t.jsx(F,{children:"TODO: Sort"}),t.jsxs(Po,{type:"single",value:d?"grid":"table",onValueChange:w=>w&&p(w==="grid"?z.GRID:z.TABLE),"aria-label":e({id:g("view.switch.label"),defaultMessage:"View options"}),children:[t.jsxs(Ee,{value:"table","aria-label":e({id:g("view.table"),defaultMessage:"Table view"}),children:[t.jsx($t,{}),e({id:g("view.table"),defaultMessage:"Table view"})]}),t.jsxs(Ee,{value:"grid","aria-label":e({id:g("view.grid"),defaultMessage:"Grid view"}),children:[t.jsx(Pt,{}),e({id:g("view.grid"),defaultMessage:"Grid view"})]})]})]})]})})}),t.jsx(ce.Content,{children:t.jsxs(Mo,{children:[t.jsx(Do,{uploadDropZoneRef:v,folderName:s}),t.jsx($o,{view:u,folderId:o,onAssetItemClick:n})]})})]})})}),t.jsx(Co,{open:a,folderName:s,parentFolderId:o,onClose:()=>i(!1)}),t.jsx(To,{open:f,onClose:()=>m(!1),onUpload:_}),t.jsx(Kn,{})]})},Go=()=>{const{formatMessage:e}=D(),n=e({id:g("plugin.name"),defaultMessage:"Media Library"});return t.jsxs(we.Main,{children:[t.jsx(we.Title,{children:n}),t.jsx(Gt,{children:t.jsx(Ut,{index:!0,element:t.jsx(_o,{})})})]})};export{Go as UnstableMediaLibrary};
