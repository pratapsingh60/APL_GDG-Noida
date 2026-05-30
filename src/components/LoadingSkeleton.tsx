export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-stadium-darker flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-green mx-auto mb-4"></div>
        <p className="text-stadium-green">Loading...</p>
      </div>
    </div>
  )
}