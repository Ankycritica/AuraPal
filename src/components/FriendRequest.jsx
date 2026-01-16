import React from 'react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'

export default function FriendRequest({ request, onAccept, onDecline, isOpen }) {
  if (!request) return null

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Friend Request</DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="mb-6">
            {request.name || 'Someone'} wants to be your friend!
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => onAccept(request)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full font-semibold"
            >
              Accept
            </Button>
            <Button
              onClick={() => onDecline(request)}
              variant="outline"
              className="px-6 py-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full"
            >
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}