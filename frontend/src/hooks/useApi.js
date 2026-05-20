import { useCallback, useState } from "react"

export const useApi = (apiFunc)=>{
    const {data,setData} = useState(null);
    const {loading,setLoading} = useState(false);
    const {error,setError} = useState(null);

    const execute = useCallback(async (...args)=>{
        setLoading(false);
        setError(null);
        try {
            const resData = await apiFunc(...args);
            setData(resData);
        }
        catch(err) {
            setError(err.response?.data || 'có lỗi xảy ra');
        }
        finally{
            setLoading(false);
        }

    },[apiFunc])

    return {data,loading,error,execute};
}