import { Html } from '@react-email/html'
import { Heading, Text, Body } from '@react-email/components'
import React from 'react'

interface TwoFactorTemplateProps {
  token: string
}

export function TwoFactorTemplate({  token }: TwoFactorTemplateProps) {

  return <Html>
    <Body>
      <Heading>Two Factor code</Heading>
      <Text>
        Please use this code for two factor authentication
      </Text>
      <Text>
        {token}
      </Text>
    </Body>
  </Html>
}
