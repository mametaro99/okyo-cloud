import { Box, Grid, Container, Link } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import useSWR from 'swr'
import OkyoCard from '@/components/OkyoCard'
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
  const url = 'http://localhost:3000/api/v1/okyo'

  const { data, error } = useSWR(url, fetcher)
  if (error) return <div>An error has occurred.</div>
  if (!data) return <div>Loading...</div>

  const okyos = camelcaseKeys(data)
  console.log(okyos)

  return (
    <Box sx={{ backgroundColor: '#e6f2ff', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          {okyos.map((okyo: OkyoProps, i: number) => (
            <Grid key={okyo.id} item xs={12} md={6}>
              <Link href={'/articles/' + okyo.id}>
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
