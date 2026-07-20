import { useState, useEffect, type CSSProperties } from 'react'
import { PulseLoader } from 'react-spinners'
import { type ResponsePlaythrough as Playthrough } from '../../types/apiData'
import { DONE, LOADING, ERROR } from '../../utils/loadingStates'
import { YELLOW } from '../../utils/colorSchemes'
import { usePlaythroughsContext, useGoogleLogin } from '../../hooks/contexts'
import DashboardLayout from '../../layouts/dashboardLayout/dashboardLayout'
import PlaythroughCreateForm from '../../components/playthroughCreateForm/playthroughCreateForm'
import PlaythroughLineItem from '../../components/playthroughLineItem/playthroughLineItem'

const loaderStyles: CSSProperties = {
  textAlign: 'center',
}

const PlaythroughsPage = () => {
  const { authLoading } = useGoogleLogin()
  const { playthroughs, playthroughsLoadingState } = usePlaythroughsContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(authLoading || playthroughsLoadingState === LOADING)
  }, [authLoading, playthroughsLoadingState])

  return (
    <DashboardLayout title="Your Playthroughs">
      <div>
        {loading && (
          <PulseLoader
            color={YELLOW.schemeColorDark}
            cssOverride={loaderStyles}
            data-testid="pulseLoader"
          />
        )}
        {playthroughsLoadingState === DONE && (
          <PlaythroughCreateForm
            disabled={
              playthroughsLoadingState === LOADING || playthroughsLoadingState === ERROR
            }
          />
        )}
        {playthroughs.length > 0 && playthroughsLoadingState === DONE && (
          <>
            {playthroughs.map(({ id, name, description }: Playthrough) => (
              <PlaythroughLineItem
                key={id}
                playthroughId={id}
                name={name}
                description={description}
              />
            ))}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PlaythroughsPage
