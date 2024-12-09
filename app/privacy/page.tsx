
const content = `
1. **Introduction**

Welcome to Outread Pty Ltd ("we," "our," or "us"). This privacy policy explains how we collect, use, disclose, and safeguard your personal information when you use our website or mobile application (collectively, the "Service") to access summarized research papers globally.

2. **About Outread and this policy**

Outread is an Australian company that provides services worldwide. We are committed to protecting your privacy and complying with applicable data protection laws, including the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs), as well as other relevant international privacy regulations such as the European Union's General Data Protection Regulation (GDPR) where applicable.

This policy applies to all personal information collected by Outread through the Service, regardless of your location. By using our Service, you consent to the collection, use, and disclosure of your personal information as described in this policy.

3. **Personal information we collect**

We collect and hold the following types of personal information:

- Identification information: name, email address, and account details
- Financial information: payment details for subscription management
- Technical information: IP address, device information, and browser type
- Usage data: information about how you use our Service, including reading history and preferences
- Communications: your interactions with our customer support team
- Location data: country of residence for compliance with local laws and regulations
4. **How we collect personal information**

We collect personal information in various ways, including:

- Directly from you when you create an account or subscribe to our Service
- Automatically as you navigate through and interact with our Service
- From third parties that provide services to us
5. **How we use your personal information**

We use your personal information for purposes including:

- Providing and improving our Service globally
- Managing your subscription and account
- Personalizing your experience with summarized research papers
- Communicating with you about our Service
- Analyzing usage patterns to enhance our offerings
- Complying with our legal obligations in various jurisdictions
6. **Disclosure of your personal information**

We may disclose your personal information to:

- Our employees and related entities
- Third-party service providers who assist us in operating our business globally
- Professional advisers such as lawyers, accountants, and insurers
- Regulatory authorities, law enforcement agencies, and other government entities as required by law in relevant jurisdictions

We do not sell your personal information to third parties.

7. **International data transfers**

As a global service provider, we may transfer, process, and store your personal information in countries other than your country of residence. We take appropriate safeguards to ensure that your personal information receives an adequate level of protection in the countries in which we process it. These safeguards may include:

- Using standard contractual clauses approved by relevant authorities
- Ensuring third-party service providers adhere to similar levels of data protection
- Implementing appropriate technical and organizational measures to protect your information

By using our Service, you consent to your personal information being transferred to other countries, including countries that may have different data protection rules than your country.

8. **Data security**

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, modification, or disclosure.

9. **Retention of personal information**

We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including for legal, accounting, or reporting requirements. The retention period may vary depending on the type of information and the requirements of different jurisdictions.

10. **Your privacy rights**

Depending on your location, you may have various privacy rights under applicable laws. These may include the right to:

- Access your personal information
- Correct your personal information
- Request deletion of your personal information
- Object to or restrict the processing of your personal information
- Data portability
- Withdraw consent at any time
- Lodge a complaint with a supervisory authority

To exercise these rights, please contact us using the details provided at the end of this policy.

11. **Changes to this privacy policy**

We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our Service or by sending you an email notification.

12. **How to contact us**

If you have any questions about this privacy policy or our privacy practices, please contact us at:

Outread Pty Ltd

Ground Floor/10 Pulteney St, Adelaide SA 5000 Email: <admin@out-read.com>

13. **Making a complaint**

If you believe we have breached applicable privacy laws or have any concerns about our privacy practices, please contact us using the details above. We will investigate your complaint and respond to you within a reasonable time. If you are not satisfied with our response, you may have the right to lodge a complaint with a supervisory authority in your jurisdiction.
`


import React from 'react'
import { createRoot } from 'react-dom/client'
import Markdown from 'react-markdown'

export default async function Page() {
    return (
        <div className="flex flex-col w-full h-full items-center justify-center bg-white">
            <div className=" w-full h-full items-center justify-center p-4">
                <div className='text-black'>
                    <h1 className='text-4xl font-bold'>Privacy Policy</h1>
                    <h1 className='text-lg font-bold mb-2'>Last Updated : 05/08/2024</h1>
                    <Markdown >
                        {content}
                    </Markdown>
                </div>
            </div>

        </div>
    );
}
