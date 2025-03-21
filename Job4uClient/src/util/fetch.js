import { useEffect, useState } from 'react';
import { getAllCodeService } from '../service/userService1';
const useFetchAllcode = (type) => {
    const [data, setdata] = useState([])
    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getAllCodeService(type)
                if (arrData && arrData.errCode === 0) {
                    setdata(arrData.data)               
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }

    }, [])
    return { data }
}
export {
    useFetchAllcode
}