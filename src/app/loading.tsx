import { Card, CardBody } from '@heroui/react'

export default function Loading() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-8">
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-800 rounded animate-pulse"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <Card key={i}>
            <CardBody className="text-center">
              <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-3 w-12 bg-gray-800 rounded animate-pulse mx-auto"></div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardBody>
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="h-32 w-full bg-gray-800 rounded animate-pulse"></div>
        </CardBody>
      </Card>
    </main>
  )
}
