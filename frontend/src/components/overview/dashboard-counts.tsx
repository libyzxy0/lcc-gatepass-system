import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card'

export function Counts() {
  return (
    <div className="mt-12">
      <h1 className="font-medium mb-4 text-gray-600">Students & Visitors</h1>
      <div className="flex flex-row flex-wrap gap-6">
        <Card className="bg-green-100 border-green-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2">2,138</CardTitle>
            <CardDescription>Enrolled Students</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 border-blue-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2">1,804</CardTitle>
            <CardDescription>Student Entered</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-green-100 border-green-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2">33</CardTitle>
            <CardDescription>Approved Visitors</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-400">
          <CardContent>
            <CardTitle className="text-3xl font-medium mb-2">104</CardTitle>
            <CardDescription>Total Visits Today</CardDescription>
          </CardContent>
        </Card>
      </div>
      </div>
  )
}