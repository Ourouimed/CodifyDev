import { CircleAlert, FileWarning, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';
import { usePopup } from '@/hooks/usePopup';
import { useToast } from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { deleteAccount } from '@/store/features/auth/authSlice';

export default function DeleteAccountPopup() {
  const { user , isLoading} = useAuth()
  const { closePopup } = usePopup()
  const toast = useToast()
  const dispatch = useDispatch()
  const [confirmData , setConfirmData]=useState({
    username : '' ,
    text : ''
  })

  const IS_DISABLED = confirmData.username !== user?.username || confirmData.text !== 'delete my account'
  const handleChange = e =>{
    const { id , value} = e.target
    setConfirmData(prev => ({...prev , [id] : value}))
  }

  const handleDeleteAccount = async ()=>{
    try {
        await dispatch(deleteAccount()).unwrap()
        toast.success('Account deleted successfully')
        closePopup()
    }

    catch (err) {
        toast.error(err || 'Failed to delete account')
    }
  }
  return <div className='space-y-2'>
   <div className="space-y-2">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Delete Account
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This action is **permanent** and will remove all data associated with your profile.
        </p>
    </div>

    <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CircleAlert className='text-red-800 size-4'/>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Unexpected bad things may happen, This action is not reversible. Please be certain before deleting.
            </p>
          </div>
        </div>
    </div>

    <div className='border-t border-border py-3 space-y-3'>
        <div className='space-y-2'>
            <label htmlFor="username" className='text-sm'>Enter your username <span className='font-semibold'>{user?.username}</span> to continue: </label>
            <Input id='username' onChange={handleChange} value={confirmData.username}/>
        </div>

        <div className='space-y-2'>
            <label htmlFor="text" className='text-sm'>To verify, type <span className='font-semibold'>delete my account</span> below: </label>
            <Input id='text' onChange={handleChange} value={confirmData.text}/>
        </div>
    </div>


    <div className='flex justify-end items-center gap-2'>
        <Button variant='OUTLINE' onClick={closePopup}>
            Cancel
        </Button>

        <Button variant='destructive' disabled={IS_DISABLED} 
                className={`${IS_DISABLED || isLoading ? 'opacity-50' : 'opacity-100'}`}
                onClick={handleDeleteAccount}>
            {isLoading ? <Loader2 className='animate-spin'/> : <Trash2 className='size-5'/>}
            {isLoading ? 'Deleting...' : 'Delete Account'}
        </Button>
    </div>

  </div>
}