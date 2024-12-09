import React from 'react';
import { Html, Head, Body, Container, Text, Button, Link } from '@react-email/components';

interface PasswordResetEmailProps {
    resetLink: string;
    downloadLink: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ resetLink, downloadLink }) => (
    <Html>
        <Head />
        <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#27394F', margin: 0, padding: 0 }}>
            <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff', color: 'black' }}>
                <Text style={{ fontSize: '18px', marginBottom: '20px' }}>Hello,</Text>

                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    We&apos;ve been hard at work improving our product offerings and are thrilled to announce the launch of our new app on iOS! You can now download it on AppStore.
                </Text>

                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Before accessing the app, please note that due to recent upgrades and a website migration, you&apos;ll need to reset your password. You can do that quickly using the link below:
                </Text>

                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    After clicking the button below, you&apos;ll be redirected to our password reset page. Simply enter your email, and you&apos;ll receive a link to reset your password. Once you click the link, you&apos;ll be able to create a new password.
                </Text>

                <Container style={{ textAlign: 'center' }}>
                    <Button
                        href={resetLink}
                        style={{
                            backgroundColor: '#27394F',
                            color: '#ffffff',
                            padding: '12px 20px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginBottom: '20px',
                        }}
                    >
                        Reset Your Password Here
                    </Button>
                </Container>


                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Once your password is updated, feel free to download the app:
                </Text>

                <Container style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Link
                        href="https://apps.apple.com/us/app/outread/id6503236023?itscg=30200&itsct=apps_box_badge&mttnsubad=6503236023"
                        style={{
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                    >
                        Download on the App Store
                    </Link>
                </Container>

                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    If you have any questions or run into any issues, don&apos;t hesitate to reach out.
                </Text>

                <Text style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Thank you for your continued support!
                </Text>

                <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
                    Best regards,<br />
                    Team Outread
                </Text>
            </Container>
        </Body>
    </Html>
);