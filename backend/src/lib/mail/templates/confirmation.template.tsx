import { Html } from '@react-email/html'
import { Heading, Link, Text, Body } from '@react-email/components'
import React from 'react'

interface ConfirmationTemplateProps {
  domain: string
  token: string
}

export function ConfirmationTemplate({
  domain,
  token
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  return <Html>
    <Body>
      {/* eslint-disable-next-line prettier/prettier */}
      <Heading>Email confirmation</Heading>
      <Text>
        To confirm email please pass to
      </Text>
      <Link href={confirmLink}>Confirm Email</Link>
      <Text>
        This link is valid during hour.
      </Text>
    </Body>
  </Html>
}
