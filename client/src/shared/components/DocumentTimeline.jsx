import DocumentTimelineItem from '@shared/components/DocumentTimelineItem'

export default function DocumentTimeline({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No documents to display.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentTimelineItem key={doc.id} document={doc} />
      ))}
    </div>
  )
}
