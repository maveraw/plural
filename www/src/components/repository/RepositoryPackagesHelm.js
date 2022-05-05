import { Link, useParams } from 'react-router-dom'
import { Div, Flex, Img, P } from 'honorable'
import { Tag } from 'pluralsh-design-system'

import usePaginatedQuery from '../../hooks/usePaginatedQuery'

import { LoopingLogo } from '../utils/AnimatedLogo'

import { CHARTS_QUERY } from './queries'

const defaultChartIcon = `${process.env.PUBLIC_URL}/chart.png`

function Chart({ chart }) {
  return (
    <Flex
      px={1}
      py={0.5}
      mb={0.5}
      as={Link}
      to={`/charts/${chart.id}`}
      color="text"
      textDecoration="none"
      align="center"
      hoverIndicator="background-light"
      borderRadius={4}
    >
      <Img
        alt={chart.name}
        width={64}
        height={64}
        src={chart.icon || defaultChartIcon}
      />
      <Div ml={1}>
        <Flex align="center">
          <P
            body1
            fontWeight={500}
          >
            {chart.name}
          </P>
          {chart.dependencies && chart.dependencies.application && (
            <Tag ml={1}>
              APP
            </Tag>
          )}
        </Flex>
        <P mt={0.5}>
          {chart.latestVersion} {chart.description ? `- ${chart.description}` : null}
        </P>
      </Div>
    </Flex>
  )
}

function RepositoryPackagesHelm() {
  const { id } = useParams()
  const [charts, loadingCharts, hasMoreCharts, fetchMoreCharts] = usePaginatedQuery(
    CHARTS_QUERY,
    {
      variables: {
        repositoryId: id,
      },
    },
    data => data.charts
  )

  if (loadingCharts) {
    return (
      <Flex
        pt={2}
        justify="center"
      >
        <LoopingLogo />
      </Flex>
    )
  }

  return (
    <Div>
      {charts.map(chart => (
        <Chart
          key={chart.id}
          chart={chart}
        />
      ))}
    </Div>
  )
}

export default RepositoryPackagesHelm
