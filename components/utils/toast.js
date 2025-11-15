import toast from 'react-hot-toast';


export const SuccessToast = (message) => {
    return (
        toast.success(message, {
            duration: 3000,
            position: 'top-center',
            style: {
                boxShadow: '0 0 8px 0 #bcbcbc',
                padding: '16px',
                color: '#713200',
            },
            ariaProps: {
                role: 'status', 'aria-live': 'polite',
            },
            removeDelay: 1000,
            toasterId: 'default',
        })
    )
}

export const FailedToast = (message) => {
    return (
        toast.error(message, {
            duration: 3000,
            position: 'top-center',
            style: {
                boxShadow: '0 0 8px 0 #bcbcbc',
                padding: '16px',
                color: '#713200',
            },
            ariaProps: {
                role: 'status', 'aria-live': 'polite',
            },
            removeDelay: 1000,
            toasterId: 'default',
        })
    )
}


