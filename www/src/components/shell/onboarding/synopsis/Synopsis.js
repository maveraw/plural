import { useContext } from 'react'
import { Article, Div, ExtendTheme, Flex, Input, P } from 'honorable'
import { Button, CloudIcon, FormField, GearTrainIcon, GitHubIcon } from 'pluralsh-design-system'

import CreateShellContext from '../../../../contexts/CreateShellContext'

import OnboardingNavSection from '../OnboardingNavSection'
import OnboardingCard from '../OnboardingCard'

function Synopsis() {
  const { workspace, setWorkspace, previous, next, error, exceptions } = useContext(CreateShellContext)

  console.log('error', error)

  return (
    <>
      <OnboardingCard
        title="Review details"
        paddingHorizontal={0}
      >
        <P color="text-light">
          After you make sure you entered everything correctly, it's time to launch the cloud shell and install your first application!
        </P>
        <Flex
          align="center"
          marginTop="medium"
          borderTop="1px solid border"
          paddingVertical="xlarge"
        >
          <Flex
            flexGrow={1}
            align="center"
          >
            <GitHubIcon
              size={24}
              color="text-light"
              paddingHorizontal="small"
            />
            <Div marginLeft="large">
              <P
                caption
                color="text-xlight"
              >
                Repository name
              </P>
              <P body1>
                xxx
              </P>
            </Div>
          </Flex>
          <Flex
            flexGrow={1}
            align="center"
          >
            <Div>
              <P
                caption
                color="text-xlight"
              >
                Git account
              </P>
              <P body1>
                xxx
              </P>
            </Div>
          </Flex>
        </Flex>
        <Flex
          wrap
          align="center"
          borderTop="1px solid border"
          paddingVertical="xlarge"
        >
          <Flex
            flexGrow={1}
            align="center"
          >
            <CloudIcon
              size={24}
              color="text-light"
              paddingHorizontal="small"
            />
            <Div marginLeft="large">
              <P
                caption
                color="text-xlight"
              >
                Region
              </P>
              <P body1>
                xxx
              </P>
            </Div>
          </Flex>
          <Flex
            flexGrow={1}
            align="center"
          >
            <Div>
              <P
                caption
                color="text-xlight"
              >
                Credentials
              </P>
              <P body1>
                ••••••••
              </P>
            </Div>
          </Flex>
          <Div
            marginTop="medium"
            width="100%"
            marginLeft="large"
            paddingLeft="xxlarge"
          >
            <P
              caption
              color="text-xlight"
            >
              Project
            </P>
            <P body1>
              xxx
            </P>
          </Div>
        </Flex>
        <Flex
          wrap
          align="center"
          borderTop="1px solid border"
          paddingTop="xlarge"
        >
          <Flex
            flexGrow={1}
            align="center"
          >
            <GearTrainIcon
              size={24}
              color="text-light"
              paddingHorizontal="small"
            />
            <Div marginLeft="large">
              <P
                caption
                color="text-xlight"
              >
                Cluster
              </P>
              <P body1>
                xxx
              </P>
            </Div>
          </Flex>
          <Flex
            flexGrow={1}
            align="center"
          >
            <Div>
              <P
                caption
                color="text-xlight"
              >
                Bucket prefix
              </P>
              <P body1>
                xxx
              </P>
            </Div>
          </Flex>
          <Div
            marginTop="medium"
            width="100%"
            marginLeft="large"
            paddingLeft="xxlarge"
          >
            <P
              caption
              color="text-xlight"
            >
              Subdomain
            </P>
            <P body1>
              xxx.onplural.sh
            </P>
          </Div>
        </Flex>
      </OnboardingCard>
      {/* Navigation */}
      <OnboardingNavSection>
        <Button
          secondary
          onClick={() => {
            previous()
          }}
        >
          Back
        </Button>
        <Button
          primary
          disabled={error}
          onClick={() => {
            next()
          }}
        >
          Continue
        </Button>
      </OnboardingNavSection>
    </>
  )
}

export default Synopsis
