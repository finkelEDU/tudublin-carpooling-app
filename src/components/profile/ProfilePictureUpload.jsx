"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ProfilePictureUpload() {
  return (
    <form action="/api/profile/upload-picture" method="POST" encType="multipart/form-data">
      <div className="flex flex-col gap-2">
        <Label htmlFor="profilePic">Profile Picture</Label>
        <Input id="profilePic" type="file" name="profilePic" accept="image/*" />
        <Button type="submit">Upload</Button>
      </div>
    </form>
  )
}
