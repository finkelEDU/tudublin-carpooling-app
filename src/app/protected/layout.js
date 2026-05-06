export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-8 w-full max-w-5xl p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
