const  KEY = 'ai_chat_session_v';

export const loadAllSessions = () => {
    try{
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    }
    catch(e){
        console.log("Load Error",e)
        return null;
    }
}

export const saveAllSessions = (state) =>{
    try{
        localStorage.setItem(KEY, JSON.stringify(state));
    }
    catch(e){
        console.log("save error",e)
    }
}