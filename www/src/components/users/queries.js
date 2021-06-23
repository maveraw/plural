import gql from 'graphql-tag'
import { UserFragment, TokenFragment, WebhookFragment, AddressFragment, AccountFragment, PublisherFragment, PublicKeyFragment, TokenAuditFragment } from '../../models/user'
import { CardFragment } from '../../models/payments';
import { PageInfo } from '../../models/misc'

export const ME_Q = gql`
  query {
    me {
      ...UserFragment
      account { ...AccountFragment }
      publisher { 
        ...PublisherFragment 
        billingAccountId
      }
    }
    configuration {
      stripeConnectId
      stripePublishableKey
      registry
    }
  }
  ${UserFragment}
  ${AddressFragment}
  ${AccountFragment}
  ${PublisherFragment}
`;

export const CARDS = gql`
  query {
    me {
      ...UserFragment
      account { ...AccountFragment }
      cards(first: 5) {
        edges { node { ...CardFragment } }
      }
    }
  }
  ${UserFragment}
  ${CardFragment}
  ${AccountFragment}
`

export const UPDATE_USER = gql`
  mutation UpdateUser($attributes: UserAttributes!) {
    updateUser(attributes: $attributes) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const TOKENS_Q = gql`
  query Tokens($cursor: String) {
    tokens(after: $cursor, first: 10) {
      pageInfo { ...PageInfo }
      edges {
        node { ...TokenFragment }
      }
    }
  }
  ${PageInfo}
  ${TokenFragment}
`;

export const CREATE_TOKEN = gql`
  mutation {
    createToken {
      ...TokenFragment
    }
  }
  ${TokenFragment}
`;

export const DELETE_TOKEN = gql`
  mutation DeleteToken($id: ID!) {
    deleteToken(id: $id) {
      ...TokenFragment
    }
  }
  ${TokenFragment}
`;

export const TOKEN_AUDITS = gql`
  query Token($id: ID!, $cursor: String) {
    token(id: $id) {
      id
      audits(first: 100, after: $cursor) {
        pageInfo { ...PageInfo }
        edges { node { ...TokenAuditFragment } }
      }
    }
  }
  ${PageInfo}
  ${TokenAuditFragment}
`

export const WEBHOOKS_Q = gql`
  query Webhooks($cursor: String) {
    webhooks(first: 10, after: $cursor) {
      edges {
        node { ...WebhookFragment }
      }
      pageInfo { ...PageInfo }
    }
  }
  ${WebhookFragment}
  ${PageInfo}
`;

export const PING_WEBHOOK = gql`
  mutation PingWebhook($repo: String!, $id: ID!) {
    pingWebhook(repo: $repo, id: $id) {
      statusCode
      body
      headers
    }
  }
`;

export const REGISTER_CARD = gql`
  mutation RegisterCard($source: String!) {
    createCard(source: $source) {
      ...AccountFragment
    }
  }
  ${AccountFragment}
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      ...AccountFragment
    }
  }
  ${AccountFragment}
`;

export const CREATE_RESET_TOKEN = gql`
  mutation Reset($attributes: ResetTokenAttributes!) {
    createResetToken(attributes: $attributes)
  }
`

export const REALIZE_TOKEN = gql`
  mutation Realize($id: ID!, $attributes: ResetTokenRealization!) {
    realizeResetToken(id: $id, attributes: $attributes)
  }
`

export const RESET_TOKEN = gql`
  query Token($id: ID!) {
    resetToken(id: $id) {
      type
      user { ...UserFragment }
    }
  }
  ${UserFragment}
`

export const LIST_KEYS = gql`
  query Keys($cursor: String) {
    publicKeys(after: $cursor, first: 20) {
      pageInfo { ...PageInfo }
      edges { node { ...PublicKeyFragment } }
    }
  }
  ${PageInfo}
  ${PublicKeyFragment}
`

export const DELETE_KEY = gql`
  mutation Delete($id: ID!) {
    deletePublicKey(id: $id) {
      id
    }
  }
`