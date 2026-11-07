export function filterTasks(tasks,status='all',category='all'){return tasks.filter(t=>(status==='all'||(status==='completed'?t.completed:!t.completed))&&(category==='all'||t.category===category))}
export function searchTasks(tasks,query=''){const q=query.trim().toLocaleLowerCase();return q?tasks.filter(t=>`${t.title} ${t.description}`.toLocaleLowerCase().includes(q)):tasks}
export function getFilteredTasks(tasks,{status='all',category='all',search=''}={}){return searchTasks(filterTasks(tasks,status,category),search)}
