// Skeleton loader for dashboard cards
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div></td>
      <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div></td>
      <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div></td>
      <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div></td>
      <td className="p-2"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div></td>
    </tr>
  );
}
