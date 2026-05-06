import { LOCATIONS } from "@/lib/locations"
import { getMongoUser } from "@/lib/getMongoUser"
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload"
import UserTypeToggle from "@/components/profile/UserTypeToggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default async function Profile() {
  const user = await getMongoUser()

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-10">
        <p className="text-muted-foreground">You must be logged in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 flex flex-col gap-6">

      <div className="border rounded-xl p-6 flex items-center gap-5">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profilePic} alt={user.username} />
          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <Badge variant="secondary" className="mt-1">{user.userType}</Badge>
        </div>
      </div>

      <div className="border rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-semibold">Profile picture</h2>
        <ProfilePictureUpload />
      </div>

      <div className="border rounded-xl p-5">
        <UserTypeToggle currentType={user.userType} />
      </div>

      <div className="border rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-semibold mb-1">About</h2>
          <p className="text-sm text-muted-foreground">{user.about || "No information provided."}</p>
        </div>
        <form action="/api/profile/update-about" method="POST" className="flex flex-col gap-3 pt-4 border-t">
          <h3 className="text-sm font-medium">Update about</h3>
          <div className="flex flex-col gap-1">
            <Label htmlFor="about">About me</Label>
            <textarea
              id="about"
              name="about"
              defaultValue={user.about}
              rows={3}
              className="border rounded-md px-3 py-2 text-sm bg-background resize-none"
            />
          </div>
          <Button type="submit" size="sm" className="w-fit">Save</Button>
        </form>
      </div>

      {user.userType === "Driver" && (
        <div className="border rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-semibold mb-3">Driver details</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Area</p>
                <p className="font-medium">{user.driverInfo?.[0]?.locationArea || "—"}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Start time</p>
                <p className="font-medium">{user.driverInfo?.[0]?.startTime || "—"}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">End time</p>
                <p className="font-medium">{user.driverInfo?.[0]?.endTime || "—"}</p>
              </div>
            </div>
          </div>

          <form action="/api/profile/update-driver-info" method="POST" className="flex flex-col gap-3 pt-4 border-t">
            <h3 className="text-sm font-medium">Update driver info</h3>
            <div className="flex flex-col gap-1">
              <Label htmlFor="locationArea">Area</Label>
              <select
                id="locationArea"
                name="locationArea"
                defaultValue={user.driverInfo?.[0]?.locationArea || ""}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">Select area</option>
                {LOCATIONS.map(place => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="startTime">Start time</Label>
                <Input id="startTime" type="time" name="startTime" defaultValue={user.driverInfo?.[0]?.startTime} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="endTime">End time</Label>
                <Input id="endTime" type="time" name="endTime" defaultValue={user.driverInfo?.[0]?.endTime} />
              </div>
            </div>
            <Button type="submit" size="sm" className="w-fit">Update</Button>
          </form>
        </div>
      )}

    </div>
  )
}
