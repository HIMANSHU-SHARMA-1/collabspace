import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const Notification = () => {

    const [notifications, setNotifications] = useState([])
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const {user} = useAuth()


    const fetchNotifications =async()=>{
        try{
            setLoading(true)
            const allNotifications = await api.get('/api/notifications/getAll')
            console.log(allNotifications.data.data)
            setNotifications(allNotifications.data.data)
            setLoading(false)

        }
        catch(err){
            setError(err?.response?.data?.message || err.message || 'Notification fetching failed')
            setLoading(false)
        }
    }

    const isRead = async(notificationId)=>{
       try{
        const isReadNotification = await api.patch(`/api/notifications/read/${notificationId}`)
       }catch(err){
        setError(err?.response?.data?.message || err.message || 'Notification fetching failed')

       }
        // console.log(isReadNotification.data)
    }


    useEffect(()=>{
        fetchNotifications()
    },[])


  return (
    <>
    {

        notifications && notifications.map((notification)=>(
            <ol key={notification._id} style={{opacity: notification.isRead?0.4:1}}>
                <li><button onClick={()=>{isRead(notification._id)}}>{notification.message}</button></li>
            </ol>
        ))
    }
    
    </>
  )
}

export default Notification