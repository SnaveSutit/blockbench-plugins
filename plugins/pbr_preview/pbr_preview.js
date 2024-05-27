"use strict";(()=>{(()=>{let j,R,L,A,I,D,H,U,w,O,F,Q,C,G,k,S,J,B,z,X,q,$={},l="pbr_preview",te="1.0.0",V="_NONE_",d={albedo:{id:"albedo",label:"Albedo",description:"The color of the material",map:"map",icon:"tonality"},metalness:{id:"metalness",label:"Metalness",description:"The material's metalness map",map:"metalnessMap",icon:"brightness_6"},emissive:{id:"emissive",label:"Emissive",description:"The material's emissive map",map:"emissiveMap",icon:"wb_twilight"},roughness:{id:"roughness",label:"Roughness",description:"The material's roughness map",map:"roughnessMap",icon:"grain"},height:{id:"height",label:"Height",description:"The material's height map",map:"bumpMap",icon:"landscape"},normal:{id:"normal",label:"Normal",description:"The material's normal map",map:"normalMap",icon:"looks"},ao:{id:"ao",label:"Ambient Occlusion",description:"The material's ambient occlusion map",map:"aoMap",icon:"motion_mode"}},P=(n=!0)=>{let e=Project?Project.textures??Texture.all:Texture.all;return n?e.filter(t=>t.layers.length>0).flatMap(t=>t.layers):e};class p{constructor(e,t){this._scope=e??P(),this._materialUuid=t}merToCanvas(){let e=this.getTexture(d.emissive),t=this.getTexture(d.roughness),a=this.getTexture(d.metalness);if(!e&&!t&&!a){let{metalness:s,emissive:i,roughness:o}=this.decodeMer();s&&(a=p.makePixelatedCanvas(s)),i&&(e=p.makePixelatedCanvas(i)),o&&(t=p.makePixelatedCanvas(o))}return{emissiveMap:e,roughnessMap:t,metalnessMap:a}}getMaterial(e={}){let{emissiveMap:t,roughnessMap:a,metalnessMap:s}=this.merToCanvas();return new THREE.MeshStandardMaterial({map:this.getTexture(d.albedo)??p.makePixelatedCanvas(TextureLayer.selected?.canvas??Texture.all.find(i=>i.selected)?.canvas??Texture.all[0].canvas),aoMap:this.getTexture(d.ao),normalMap:this.getTexture(d.normal),bumpMap:this.getTexture(d.height),metalnessMap:s,metalness:s?1:0,roughnessMap:a,roughness:a?1:0,emissiveMap:t,emissiveIntensity:t?1:0,emissive:t?16777215:0,envMap:PreviewScene.active?.cubemap??null,envMapIntensity:1,alphaTest:.5,...e})}saveTexture(e,{uuid:t,extend:a}){Project&&(Project.pbr_materials||(Project.pbr_materials={}),Project.pbr_materials[this._materialUuid]||(Project.pbr_materials[this._materialUuid]={}),Project.pbr_materials[this._materialUuid][e.id]=t,a({channel:e.id}))}findTexture(e,t=!0){if(!Project)return null;let a=this._scope.find(r=>r.channel&&(r.channel===e||r.channel===e.id));if(a)return a;let s=typeof e=="string"?e:e.id;Project.pbr_materials??={};let i=Project.pbr_materials[this._materialUuid];if(!i&&t){let r=new RegExp(`_*${s}(.[^.]+)?$`,"i");return this._scope.find(c=>r.test(c.name))??null}let o=i?.[s];return o?this._scope.find(r=>r.uuid===o)??null:null}static makePixelatedCanvas(e){let t=new THREE.CanvasTexture(e,void 0,void 0,void 0,THREE.NearestFilter,THREE.NearestFilter);return t.needsUpdate=!0,t}getTexture(e){let t=this.findTexture(e);return t?p.makePixelatedCanvas(t.canvas):null}static extractChannel(e,t){let a=e.canvas,s=a.width,i=a.height,o=a.getContext("2d");if(!o||!s||!i)return null;let r=document.createElement("canvas");r.width=s,r.height=i;let c=r.getContext("2d");if(!c)return null;let m={r:0,g:1,b:2,a:3}[t],{data:f}=o.getImageData(0,0,s,i),x=new Uint8ClampedArray(s*i*4);for(let h=0;h<f.length;h+=4)x[h]=f[h+m],x[h+1]=f[h+m],x[h+2]=f[h+m],x[h+3]=255;let v=new ImageData(x,s,i);return c.putImageData(v,0,0),r}decodeMer(e=25.5){let t=this.findTexture("mer",!0);if(!t)return{metalness:null,emissive:null,emissiveLevel:null,roughness:null,sss:null};let a=p.extractChannel(t,"r"),s=p.extractChannel(t,"g"),i=p.extractChannel(t,"b"),o=p.extractChannel(t,"a"),r=document.createElement("canvas");r.width=t.img.width??16,r.height=t.img.height??16;let c=this.findTexture(d.albedo);c&&(r.width=c.img.width??16,r.height=c.img.height??16);let m=r.getContext("2d"),f=s?.getContext("2d"),x=c?.canvas?.getContext("2d");if(!m||!x||!f)return{metalness:a,emissive:s,roughness:i,sss:o};let v=x.getImageData(0,0,r.width,r.height),h=f.getImageData(0,0,r.width,r.height),_=new Uint8ClampedArray(r.width*r.height*4);for(let g=0;g<v.data.length;g+=4){if(h.data[g]>e){_[g]=v.data[g],_[g+1]=v.data[g+1],_[g+2]=v.data[g+2],_[g+3]=255;continue}_[g]=0,_[g+1]=0,_[g+2]=0,_[g+3]=255}return m.putImageData(new ImageData(_,r.width,r.height),0,0),{metalness:a,emissive:r,emissiveLevel:s,roughness:i,sss:o}}createMer(e=!1){let t=this.findTexture(d.metalness,e),a=this.findTexture(d.emissive,e),s=this.findTexture(d.roughness,e),i=this.findTexture("sss",!1),o=Math.max(t?.img.width??0,a?.img.width??0,s?.img.width??0,Project?Project.texture_width:0,16),r=Math.max(t?.img.height??0,a?.img.height??0,s?.img.height??0,Project?Project.texture_height:0,16),c=document.createElement("canvas");c.width=o,c.height=r;let m=c.getContext("2d");if(!m)return null;let f=t?.img?p.extractChannel(t,"r"):null,x=a?.img?p.extractChannel(a,"g"):null,v=s?.img?p.extractChannel(s,"b"):null,h=i&&i?.img?p.extractChannel(i,"a"):null,_=f?.getContext("2d")?.getImageData(0,0,o,r)??new ImageData(o,r),g=x?.getContext("2d")?.getImageData(0,0,o,r)??new ImageData(o,r),u=v?.getContext("2d")?.getImageData(0,0,o,r)??new ImageData(o,r),b=h?.getContext("2d")?.getImageData(0,0,o,r)??new ImageData(new Uint8ClampedArray(o*r*4).fill(255),o,r),M=new Uint8ClampedArray(o*r*4);for(let T=0;T<M.length;T+=4)M[T]=_.data[T],M[T+1]=g.data[T],M[T+2]=u.data[T],M[T+3]=b.data[T];return m.putImageData(new ImageData(M,o,r),0,0),c}static createNormalMap(e,t=!1){let a=e.canvas.getContext("2d");if(!a)return null;let s=Math.max(e.img.width??e.canvas.width,16),i=Math.max(e.img.height??e.canvas.height,16),{data:o}=a.getImageData(0,0,s,i),r=document.createElement("canvas"),c=r.getContext("2d");if(!c)return null;let m=(u,b)=>{let M=(u+b*s)*4;return o[M]/255};r.width=s,r.height=i,c.drawImage(e.img,0,0,s,i);let f=c.getImageData(0,0,s,i),x=f.data,v=u=>{let b=Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);return[u[0]/b,u[1]/b,u[2]/b]};for(let u=0;u<i;u++)for(let b=0;b<s;b++){let M=m(Math.max(b-1,0),u),T=m(Math.min(b+1,s-1),u),ie=m(b,Math.max(u-1,0)),oe=m(b,Math.min(u+1,i-1)),le=T-M,ce=oe-ie,N=v([-le,-ce,1]),E=(u*s+b)*4;x[E]=(N[0]+1)/2*255,x[E+1]=(N[1]+1)/2*255,x[E+2]=(N[2]+1)/2*255,x[E+3]=t?m(b,u)*255:255}c.putImageData(f,0,0);let h=r.toDataURL(),_=`${e.name.replace(/_height(map)?/i,"")}_normal`;if(e instanceof TextureLayer){let u=new TextureLayer({name:_,data_url:h},e.texture);return e.texture.layers.push(u),u}let g=new Texture({name:_,saved:!1,particle:!1,keep_size:!0}).fromDataURL(h);return Project&&Project.textures.push(g),g}}O=new Property(TextureLayer,"enum","channel",{default:V,values:Object.keys(d).map(n=>d[n].id),label:"PBR Channel",exposed:!1}),z=new Property(ModelProject,"object","pbr_materials",{default:{},exposed:!1,label:"PBR Materials"}),X=new Property(ModelProject,"object","bb_materials",{default:{},exposed:!1,label:"Project Materials"}),q=new Property(ModelProject,"boolean","pbr_active",{default:!1,exposed:!0,values:[],label:"PBR Mode"});let K=n=>{let e=Texture.all.find(a=>a.selected);if(!e)return;let t=new p(e.layers_enabled?e.layers:Project?Project.textures:null,e.uuid).createMer(!1);t&&t.toBlob(async a=>{if(!a)return;let[s,i]=Project?[`${e.name??Project.getDisplayName()}_mer`,Project.export_path]:["mer"];Blockbench.export({content:await a.arrayBuffer(),type:"PNG",name:s,extensions:["png"],resource_id:"mer",savetype:"image",startpath:i},n)})},y=n=>{if(!Project||Texture.all.length===0)return;let e=!1;Project.elements.forEach(t=>{t instanceof Cube&&Object.keys(t.faces).forEach(a=>{let i=t.faces[a].getTexture();if(!i)return;let o=Project.materials[i.uuid];o.isShaderMaterial&&!Project.bb_materials[i.uuid]&&(Project.bb_materials[i.uuid]=o);let r=new p(i.layers_enabled?i.layers.filter(c=>c.visible)??null:Project.textures,i.uuid).getMaterial(n);Project.materials[i.uuid]=THREE.ShaderMaterial.prototype.copy.call(r,o),Canvas.updateAllFaces(i),e=!0})}),Project.pbr_active=e},ne=()=>{!Project||!Project.bb_materials||(Project.elements.forEach(n=>{n instanceof Cube&&Object.keys(n.faces).forEach(e=>{let a=n.faces[e].getTexture();if(!a)return;let s=Project.bb_materials[a.uuid];s&&(Project.materials[a.uuid]=s)})}),Project.pbr_active=!1,Canvas.updateAll())},ae=()=>{if(!Project)return;let n=P();Project.textures.forEach(e=>{let t=new p(n,e.uuid),a=t.findTexture(d.normal,!1)?.name,s=t.findTexture(d.height,!1)?.name,i=t.findTexture(d.albedo,!1)?.name,o=t.findTexture(d.metalness,!1)?.name,r=t.findTexture(d.emissive,!1)?.name,c=t.findTexture(d.roughness,!1)?.name,m={};return i||(m.baseColor={type:"color",label:"Base Color",value:"#ff00ff"}),!o&&!r&&!c&&(m.metalness={label:"Metalness",type:"range",min:0,max:255,step:1,value:0},m.emissive={label:"Emissive",type:"range",min:0,max:255,step:1,value:0},m.roughness={label:"Roughness",type:"range",min:0,max:255,step:1,value:0}),a&&s&&(m.depthMap={type:"radio",label:"Depth Map",options:{normal:"Normal Map",heightmap:"Height"},value:"normal"}),w=new Dialog(`${l}_texture_set`,{id:`${l}_texture_set`,title:"Create Texture Set JSON",buttons:["Create","Cancel"],form:m,onConfirm(f){let x=Project.model_identifier.length>0?Project.model_identifier:Project.getDisplayName(),v=o||r||c,h={format_version:"1.16.100","minecraft:texture_set":{color:(i?pathToName(i,!1):f.baseColor?.toHexString())??x,metalness_emissive_roughness:[f.metalness??0,f.emissive??0,f.roughness??255]}};f.depthMap==="normal"&&a?h["minecraft:texture_set"].normal=pathToName(a,!1):(!a||f.depthMap==="heightmap")&&s&&(h["minecraft:texture_set"].heightmap=pathToName(s,!1));let _=()=>Blockbench.export({content:JSON.stringify(h,null,2),type:"JSON",name:`${x}.texture_set`,extensions:["json"],resource_id:"texture_set",startpath:Project.export_path},()=>{Blockbench.showQuickMessage("Texture set created",2e3),w.hide()});if(v){K(g=>{h["minecraft:texture_set"].metalness_emissive_roughness=pathToName(g,!1),_()});return}_()},cancelIndex:1}),w.show(),w})},W=["undo","redo","add_texture","finish_edit","finished_edit","load_project","select_preview_scene","change_texture_path","select_project"],Y=()=>Project&&Project.pbr_active&&y(),Z=()=>{W.forEach(n=>{Blockbench.addListener(n,Y)})},ee=()=>{W.forEach(n=>{Blockbench.removeListener(n,Y)})},se=()=>{H=new Setting("pbr_active",{category:"preview",name:"Enable PBR Preview",description:"Enables PBR preview in the editor",type:"toggle",default_value:!1,icon:"tonality",launch_setting:!0,onChange(n){if(n){y(),Z();return}ne(),ee()}}),J=new Setting("display_settings_correct_lights",{category:"preview",name:"Correct Lights",description:"Corrects the lighting in the preview for PBR materials",type:"toggle",default_value:!1,icon:"light_mode",condition:()=>!!Project,onChange(n){Preview.selected.renderer.physicallyCorrectLights=n,y()}}),B=new Setting("display_settings_tone_mapping",{category:"preview",name:"Tone Mapping",description:"Changes the tone mapping of the preview",type:"select",default_value:THREE.NoToneMapping,value:THREE.NoToneMapping,icon:"palette",options:{[THREE.NoToneMapping]:"None",[THREE.LinearToneMapping]:"Linear",[THREE.ReinhardToneMapping]:"Reinhard",[THREE.CineonToneMapping]:"Cineon",[THREE.ACESFilmicToneMapping]:"ACES"},onChange(n){Preview.selected.renderer.toneMapping=Number(n),y()}}),S=new Setting("display_settings_exposure",{category:"preview",name:"Exposure",description:"Adjusts the exposure of the scene",type:"number",default_value:1,icon:"exposure",step:.1,min:-2,max:2,onChange(n){Preview.selected.renderer.toneMappingExposure=Math.max(-2,Math.min(2,Number(n)))}}),A=new Action(`${l}_generate_normal`,{icon:"altitude",name:"Generate Normal Map",description:"Generates a normal map from the height map",condition:()=>(TextureLayer.selected||Texture.all.find(n=>n.selected))!==void 0,click(){let n=TextureLayer.selected??Texture.all.find(s=>s.selected),e=new p(P(),n.uuid),t=TextureLayer.selected??Texture.all.find(s=>s.selected)??e.findTexture(d.height,!0);if(!t){Blockbench.showQuickMessage("No height map found",2e3);return}let a=p.createNormalMap(t);if(a){e.saveTexture(d.normal,a),a.select(),Blockbench.showQuickMessage("Normal map generated",2e3);return}Blockbench.showQuickMessage("Failed to generate normal map",2e3)}}),L=new Action(`${l}_create_mer`,{icon:"lightbulb_circle",name:"Export MER",description:"Exports a texture map from the metalness, emissive, and roughness channels. (For use in Bedrock resource packs.)",click(){K()}}),j=new Action(`${l}_decode_mer`,{icon:"arrow_split",name:"Decode MER",description:"Decodes a MER texture map into metalness, emissive, and roughness channels",click(){let n=P(),e=TextureLayer.selected?.texture??Texture.all.find(i=>i.selected),t=new p(n,(e??n[0]).uuid),a=t.decodeMer();[d.metalness,d.emissive,d.roughness].forEach((i,o)=>{let r=i.id,c=a[r];if(!c)return;let m=new TextureLayer({name:`${e?.name}_${r}`,data_url:c.toDataURL()},e.layers_enabled?e.texture:e);t.saveTexture(i,m)})}}),R=new Action(`${l}_create_texture_set`,{name:"Create Texture Set",icon:"layers",description:"Creates a texture set JSON file. Generates a MER when metalness, emissive, or roughness channels are set.",click(){ae()}}),Object.entries(d).forEach(([n,e])=>{$[n]=new Action(`${l}_assign_channel_${n}`,{icon:e.icon??"tv_options_edit_channels",name:`Assign to ${e.label.toLocaleLowerCase()} channel`,description:`Assign the selected layer to the ${e.label} channel`,category:"textures",condition:()=>Modes.paint&&TextureLayer.selected,click(t){let a=TextureLayer.selected;if(!a||!Project)return;Undo.initEdit({layers:[a]}),a.extend({channel:n});let s=a.texture;s.updateChangesAfterEdit(),Project.pbr_materials[s.uuid]||(Project.pbr_materials[s.uuid]={}),Object.entries(Project.pbr_materials[s.uuid]).forEach(([i,o])=>{o===a.uuid&&delete Project.pbr_materials[s.uuid][i]}),Project.pbr_materials[s.uuid][n]=a.uuid,Undo.finishEdit("Change channel assignment"),Blockbench.showQuickMessage(`Assigned "${a.name}" to ${e.label} channel`,2e3),y()}})}),I=new Action(`${l}_unassign_channel`,{icon:"cancel",name:"Unassign Channel",description:"Unassign the selected layer from the channel",category:"textures",click(){let n=TextureLayer.selected;if(!n||!Project)return;Undo.initEdit({layers:[n]});let{texture:e,channel:t}=n;e.updateChangesAfterEdit(),Project.pbr_materials[e.uuid]={},n.channel=V,Undo.finishEdit("Unassign channel"),Blockbench.showQuickMessage(`Unassigned "${n.name}" from ${t} channel`,2e3),y()}}),D=new Toggle("toggle_pbr",{name:"PBR Preview",description:"Toggle PBR Preview",icon:"panorama_photosphere",category:"view",linked_setting:"pbr_active",default:!1,click(){},onChange(n){Blockbench.showQuickMessage(`PBR Preview is now ${n?"enabled":"disabled"}`,2e3)}}),k=new Toggle(`${l}_correct_lights`,{category:"preview",name:"Correct Lights",description:"Corrects the lighting in the preview",icon:"fluorescent",linked_setting:"display_settings_correct_lights",default:!1,onChange(n){Blockbench.showQuickMessage(`Physically corrected lighting is now ${n?"enabled":"disabled"}`,2e3)},click(){}}),C=new BarSlider(`${l}_exposure`,{category:"preview",name:"Exposure",description:"Adjusts the exposure of the scene",icon:"exposure",min:-2,max:2,step:.1,value:Settings.get("display_settings_exposure")??1,display_condition:{modes:["edit","paint","animate"],project:!0},onChange({value:n}){S.set(n)}}),C.addLabel(!0,C),F=new Menu(`${l}_channel_menu`,[...Object.keys(d).map(n=>`${l}_assign_channel_${n}`),`${l}_unassign_channel`],{onOpen(){y()}}),Q=new Action(`${l}_show_channel_menu`,{icon:"texture",name:"Assign to PBR Channel",description:"Assign the selected layer to a channel",category:"textures",condition:()=>Modes.paint&&TextureLayer.selected,click(n){F.open(n)}}),G=new BarSelect(`${l}_tonemapping`,{category:"preview",name:"Tone Mapping",description:"Select the tone mapping function",icon:"palette",value:THREE.NoToneMapping,linked_setting:"display_settings_tone_mapping",options:{[THREE.NoToneMapping]:{name:"No Tone Mapping",icon:"invert_colors_off"},[THREE.LinearToneMapping]:{name:"Linear",icon:"linear_scale"},[THREE.ReinhardToneMapping]:{name:"Reinhard",icon:"brightness_medium"},[THREE.CineonToneMapping]:{name:"Cineon",icon:"brightness_high"},[THREE.ACESFilmicToneMapping]:{name:"ACES",icon:"brightness_auto"}},onChange({value:n}){B.set(n),y()}}),U=new Panel(`${l}_display_settings`,{name:"PBR Settings",id:`${l}_display_settings_panel`,icon:"display_settings",toolbars:[new Toolbar(`${l}_controls_toolbar`,{id:`${l}_controls_toolbar`,children:["toggle_pbr",`${l}_correct_lights`,`${l}_show_channel_menu`],name:"PBR"}),new Toolbar(`${l}_display_settings_toolbar`,{id:`${l}_display_settings_toolbar`,children:[`${l}_tonemapping`,`${l}_exposure`],name:"Display Settings"})],display_condition:{modes:["edit","paint","animate"],project:!0},component:{},expand_button:!0,growable:!1,onFold(){},onResize(){},default_side:"left",default_position:{slot:"left_bar",float_position:[0,0],float_size:[400,300],height:300,folded:!1},insert_after:"textures",insert_before:"paint"}),MenuBar.addAction(L,"file.export"),MenuBar.addAction(A,"tools"),MenuBar.addAction(j,"tools"),MenuBar.addAction(R,"file.export"),MenuBar.addAction(D,"view"),MenuBar.addAction(k,"preview"),Object.entries($).forEach(([n,e],t)=>{MenuBar.addAction(e,`image.${t}`)}),Z()},re=()=>{Object.entries($).forEach(([n,e])=>{e.delete()}),MenuBar.removeAction(`file.export.${l}_create_mer`),MenuBar.removeAction(`file.export.${l}_create_texture_set`),MenuBar.removeAction(`tools.${l}_generate_normal`),ee(),U?.delete(),w?.delete(),H?.delete(),L?.delete(),A?.delete(),D?.delete(),j?.delete(),R?.delete(),O?.delete(),Q?.delete(),S?.delete(),C?.delete(),G?.delete(),k?.delete(),J?.delete(),B?.delete(),deactivatePbr?.delete(),I?.delete(),X?.delete(),z?.delete(),q?.delete()};BBPlugin.register(l,{version:te,title:"PBR Features",author:"Jason J. Gardner",description:"Create RTX/Deferred Rendering textures in Blockbench. Adds support for previewing PBR materials and exporting them in Minecraft-compatible formats.",tags:["PBR","RTX","Deferred Rendering"],icon:"icon.png",variant:"both",await_loading:!0,new_repository_format:!0,repository:"https://github.com/jasonjgardner/blockbench-plugins",has_changelog:!0,min_version:"4.10.1",onload:se,onunload:re})})();})();
