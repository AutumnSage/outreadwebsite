'use client'

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
    return <>Success</>
}
//     export default function SuccessPage() {
//     const [message, setMessage] = useState('Processing your subscription...');
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     if (!searchParams) {
//         router.push('/')
//     }

//     const sessionId = searchParams.get('search')

//     const updateUserStatus = async (sessionId: string) => {
//         try {
//             const response = await fetch('/api/update-user-status', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ session_id: sessionId }),
//             });

//             if (response.ok) {
//                 setMessage('Thank you for your subscription! Your account has been upgraded.');
//             } else {
//                 const errorData = await response.json();
//                 setMessage(`Error: ${errorData.error.message}`);
//             }
//         } catch (error) {
//             console.error('Error updating user status:', error);
//             setMessage('An error occurred while processing your subscription. Please contact support.');
//         }
//     };

//     updateUserStatus(sessionId!)

//     function SearchBarFallback() {
//         return <>Loading...</>
//     }

//     return (
//         <Suspense fallback={<SearchBarFallback />}>
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="bg-white text-black  p-8 rounded-lg shadow-md text-center">
//                     <h1 className="text-2xl font-bold mb-4">Subscription Status</h1>
//                     <p className="text-lg">{message}</p>
//                 </div>
//             </div>
//         </Suspense>
//     );
// }