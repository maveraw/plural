import { useMutation, useQuery } from '@apollo/client'
import { Box } from 'grommet'
import { Button, Span } from 'honorable'
import moment from 'moment'
import { useState } from 'react'
import lookup from 'country-code-lookup'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  CopyIcon,
  EmptyState,
  GraphIcon,
  IconFrame,
  InfoIcon,
  ListIcon,
  Modal,
  PageTitle,
  Toast,
  Tooltip,
} from 'pluralsh-design-system'

import { Placeholder } from '../utils/Placeholder'

import {
  appendConnection,
  deepUpdate,
  extendConnection,
  removeConnection,
  updateCache,
} from '../../utils/graphql'
import {
  CREATE_TOKEN,
  DELETE_TOKEN,
  TOKENS_Q,
  TOKEN_AUDITS,
  TOKEN_METRICS,
} from '../users/queries'
import { obscure } from '../users/utils'
import { LoopingLogo } from '../utils/AnimatedLogo'
import { StandardScroller } from '../utils/SmoothScroller'

import { Table, TableData, TableRow } from '../utils/Table'

import { formatLocation } from '../../utils/geo'

import { Chloropleth } from '../utils/Chloropleth'

import { Confirm } from '../account/Confirm'

import { DeleteIconButton } from '../utils/IconButtons'

import { ListItem } from './ListItem'

const TOOLTIP = 'Access tokens allow you to access the Plural API for automation and active Plural clusters.'

function TokenAudits({ token }: any) {
  const [listRef, setListRef] = useState<any>(null)
  const { data, loading, fetchMore } = useQuery(TOKEN_AUDITS, { variables: { id: token.id }, fetchPolicy: 'cache-and-network' })

  if (!data) return null

  const { audits: { pageInfo, edges } } = data.token

  if (edges.length === 0) {
    return (
      <>
        Token has yet to be used
      </>
    )
  }

  return (
    <Box
      height="60vh"
      width="80vw"
    >
      <Table
        headers={['IP', 'Location', 'Timestamp', 'Count']}
        sizes={['25%', '25%', '25%', '25%']}
        width="100%"
        height="100%"
      >
        <Box fill>
          <StandardScroller
            listRef={listRef}
            setListRef={setListRef}
            hasNextPage={pageInfo.hasNextPage}
            items={edges}
            loading={loading}
            placeholder={Placeholder}
            mapper={({ node }, { next }) => (
              <TableRow last={!next.node}>
                <TableData>{node.ip}</TableData>
                <TableData>{formatLocation(node.country, node.city)}</TableData>
                <TableData>{moment(node.timestamp).format('lll')}</TableData>
                <TableData>{node.count}</TableData>
              </TableRow>
            )}
            loadNextPage={() => pageInfo.hasNextPage && fetchMore({
              variables: { cursor: pageInfo.endCursor },
              updateQuery: (prev, { fetchMoreResult: { token } }) => deepUpdate(prev, 'token', prevToken => (
                extendConnection(prevToken, token.audits, 'audits')
              )),
            })}
          />
        </Box>
      </Table>
    </Box>
  )
}

function TokenMetrics({ token }: any) {
  const { data } = useQuery(TOKEN_METRICS, {
    variables: { id: token.id },
    fetchPolicy: 'cache-and-network',
  })

  if (!data) return null

  const metrics = data.token.metrics.map(({ country, count }) => ({
    // @ts-expect-error
    id: lookup.byIso(country).iso3, value: count,
  }))

  return (
    <Box
      width="70vw"
      height="50vh"
      pad="small"
    >
      <Chloropleth data={metrics} />
    </Box>
  )
}

function AccessToken({ token, first, last }: any) {
  const [displayCopyBanner, setDisplayCopyBanner] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [audits, setAudits] = useState(false)
  const [graph, setGraph] = useState(false)
  const [mutation, { loading, error }] = useMutation(DELETE_TOKEN, {
    variables: { id: token.id },
    // @ts-expect-error
    update: (cache, { data: { deleteToken } }) => updateCache(cache, {
      query: TOKENS_Q,
      update: prev => removeConnection(prev, deleteToken, 'tokens'),
    }),
    onCompleted: () => setConfirm(false),
  })

  return (
    <>
      <ListItem
        first={first}
        last={last}
      >
        <Box
          fill="horizontal"
          gap="xsmall"
        >
          <Span fontWeight="bold">{obscure(token.token)}</Span>
          <Span color="text-light">Created {moment(token.insertedAt).fromNow()}</Span>
        </Box>
        <Box
          flex={false}
          width="35%"
          align="center"
          direction="row"
          justify="end"
          gap="small"
        >
          {displayCopyBanner && (
            <Toast
              severity="success"
              marginBottom="medium"
              marginRight="xxxxlarge"
            >Access token copied successfully.
            </Toast>
          )}
          <CopyToClipboard
            text={token.token}
            onCopy={() => {
              setDisplayCopyBanner(true)
              setTimeout(() => setDisplayCopyBanner(false), 1000)
            }}
          >
            <Button
              secondary
              startIcon={<CopyIcon size={15} />}
            >
              Copy key
            </Button>
          </CopyToClipboard>
          <>
            <IconFrame
              textValue=""
              clickable
              size="medium"
              icon={<GraphIcon />}
              onClick={() => setGraph(true)}
            />
            <Modal
              header="Usage metrics"
              open={graph}
              portal
              onClose={() => setGraph(false)}
            >
              <TokenMetrics token={token} />
            </Modal>
          </>
          <>
            <IconFrame
              textValue=""
              clickable
              size="medium"
              icon={<ListIcon />}
              onClick={() => setAudits(true)}
            />
            <Modal
              header="Audit logs"
              open={audits}
              portal
              onClose={() => setAudits(false)}
            >
              <TokenAudits token={token} />
            </Modal>
          </>
          <DeleteIconButton onClick={() => setConfirm(true)} />
        </Box>
      </ListItem>
      <Confirm
        open={confirm}
        title="Delete Access Token"
        text="Are you sure you want to delete this api access token?"
        close={() => setConfirm(false)}
        submit={() => mutation()}
        loading={loading}
        destructive
        error={error}
      />
    </>
  )
}

export function AccessTokens() {
  const [displayNewBanner, setDisplayNewBanner] = useState(false)
  const [listRef, setListRef] = useState<any>(null)
  const { data, loading: loadingTokens, fetchMore } = useQuery(TOKENS_Q)
  const [mutation, { loading }] = useMutation(CREATE_TOKEN, {
    // @ts-expect-error
    update: (cache, { data: { createToken } }) => updateCache(cache, {
      query: TOKENS_Q,
      update: prev => appendConnection(prev, createToken, 'tokens'),
    }),
  })

  if (!data) return <LoopingLogo />

  const { edges, pageInfo } = data.tokens

  return (
    <Box fill>
      <PageTitle
        heading="Access tokens"
        justifyContent="flex-start"
      >
        <Box
          flex
          direction="row"
          align="center"
        >
          <Tooltip
            width="315px"
            label={TOOLTIP}
          >
            <Box
              flex={false}
              pad="6px"
              round="xxsmall"
              hoverIndicator="fill-two"
            >
              <InfoIcon />
            </Box>
          </Tooltip>
          <Box
            flex
            align="end"
          >
            {displayNewBanner && (
              <Toast
                severity="success"
                marginBottom="medium"
                marginRight="xxxxlarge"
              >New access token created.
              </Toast>
            )}
            <Button
              secondary
              onClick={() => {
                setDisplayNewBanner(true)
                setTimeout(() => setDisplayNewBanner(false), 1000)
                mutation()
              }}
              loading={loading}
            >
              Create access token
            </Button>
          </Box>
        </Box>
      </PageTitle>
      <Box
        fill
      >
        {edges?.length
          ? (
            <StandardScroller
              listRef={listRef}
              setListRef={setListRef}
              items={edges}
              mapper={({ node }, { next, prev }) => (
                <AccessToken
                  token={node}
                  first={!prev.node}
                  last={!next.node}
                />
              )}
              loading={loadingTokens}
              placeholder={Placeholder}
              hasNextPage={pageInfo.hasNextPage}
              loadNextPage={pageInfo.hasNextPage && fetchMore({
                variables: { cursor: pageInfo.endCursor },
                updateQuery: (prev, { fetchMoreResult: { tokens } }) => extendConnection(prev, tokens, 'tokens'),
              })}
            />
          ) : (
            <EmptyState message="Looks like you don't have any access tokens yet.">
              <Button
                onClick={() => {
                  setDisplayNewBanner(true)
                  setTimeout(() => setDisplayNewBanner(false), 1000)
                  mutation()
                }}
                loading={loading}
              >
                Create access token
              </Button>
            </EmptyState>
          )}
      </Box>
    </Box>
  )
}
