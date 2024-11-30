import { Box, Grid, Container, Link } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import OkyoCard from '@/components/OkyoCard'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { styles } from '@/styles'
import { fetcher } from '@/utils'

type OkyoProps = {
  id: number
  name: string
  description: string
  videoUrl: string
  articleUrl: string
  createdAt: string
}

const Index: NextPage = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/okyo'

  const { data, error } = useSWR(url, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const okyos = camelcaseKeys(data)
  console.log(okyos)

  return (
    <Box css={styles.pageMinHeight} sx={{ backgroundColor: '#e6f2ff' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          {okyos.map((okyo: OkyoProps, i: number) => (
            <Grid key={okyo.id} item xs={12} md={6}>
              <Link href={'/okyos/' + okyo.id}>
                <OkyoCard
                  name={okyo.name}
                  description={okyo.description}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Index
