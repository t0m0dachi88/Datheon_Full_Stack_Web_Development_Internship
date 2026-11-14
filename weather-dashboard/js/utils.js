export function toUnit(c,unit){return unit==='F'?c*9/5+32:c}
export function formatTemp(c,unit){return `${Math.round(toUnit(c,unit))}°${unit}`}
export function cityTime(unix,offset,options){return new Intl.DateTimeFormat('en-US',{...options,timeZone:'UTC'}).format(new Date((unix+offset)*1000))}
export function dayKey(unix,offset){return new Date((unix+offset)*1000).toISOString().slice(0,10)}
export function weatherIcon(code,night=false){if(code>=200&&code<300)return 'ϟ';if(code>=300&&code<600)return '☂';if(code>=600&&code<700)return '❄';if(code>=700&&code<800)return '≋';if(code===800)return night?'☾':'☀';return '☁'}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
