import { Html } from '@react-email/html'
import { Heading, Link, Text, Body } from '@react-email/components'
import React from 'react'

interface ResetPasswordTemplateProps {
  domain: string
  token: string
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
  const link = `${domain}/auth/new-password?token=${token}`

  return <Html>
    <Body>
      {/* eslint-disable-next-line prettier/prettier */}
      <Heading>Password reset</Heading>
      <Text>
       To reset password please pass to the link
      </Text>
      <Link href={link}>Reset Password Link</Link>
      <Text>
        This link is valid during hour.
      </Text>
    </Body>
  </Html>
}
