import { Box, Grid, Container, Link } from '@mui/material'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
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
    <Box
      css={styles.pageMinHeight}
      sx={{
        backgroundImage: 'url(/unkai.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 1.5s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        }
      }}
    >
      <Container maxWidth="md" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          {okyos.map((okyo: OkyoProps) => (
            <Grid key={okyo.id} item xs={6} md={4}>
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
      <Container
        maxWidth="md"
        sx={{
          pt: 6,
          animation: 'floatUp 2s ease forwards',
          opacity: 0,
          '@keyframes floatUp': {
            from: { transform: 'translateY(20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明の白背景
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          このアプリはお経の動画・音声に合わせて、お経の意味や読み方を表示するアプリです。初学者や仏道を目指す方にとってより分かりやすくお経を理解するために作りました。
          また、葬式などの式典で配られる経本（お経の書かれた冊子）について、アプリで代用することができます。
        </Box>
      </Container>
    </Box>
  )
}

export default Index
