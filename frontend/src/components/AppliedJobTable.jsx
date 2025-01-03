import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div>
            <Table>
                <TableCaption>List of jobs you have applied for</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Job position</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? <span>You have not applied for any jobs yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
  <Badge
    className={`${
      {
        0: 'bg-gray-400',       // Pending
        1: 'bg-green-400',      // Accepted
        2: 'bg-red-400',        // Rejected
        3: 'bg-blue-400',       // Mời phỏng vấn
        4: 'bg-yellow-400',     // Kết quả phỏng vấn
        5: 'bg-purple-400',     // Thư mời nhận việc
      }[appliedJob?.status] || 'bg-gray-400' // Default
    }`}
  >
    {
      {
        0: 'Pending',
        1: 'Accepted',
        2: 'Rejected',
        3: 'Interview invitation',
        4: 'Interview results',
        5: 'Job offer letter',
      }[appliedJob?.status] || 'Pending' // Default
    }
  </Badge>
</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable
