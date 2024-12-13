import {
  Box,
  Container,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import ArticleIcon from '@mui/icons-material/Article'
import UpdateIcon from '@mui/icons-material/Update'
import camelcaseKeys from 'camelcase-keys'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { fetcher } from '@/utils'
import VideoAndSubtitle from '@/components/VideoAndSubtitle' // 新しいコンポーネントをインポート
import { styles } from '@/styles'

type OkyoPhraseProps = {
  id: number
  okyoId: number
  order: number
  phraseText: string
  meaning?: string
  reading?: string
  videoStartTime: number // 動画中の字幕開始時間（秒）
  videoEndTime: number   // 動画中の字幕終了時間（秒）
}

type OkyoProps = {
  id: number
  name: string
  description: string
  video: string
  articleUrl: string
  published: boolean
  createdAt: string
  updatedAt: string
}

const OkyoDetail: NextPage = () => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + '/okyo/'
  const { id } = router.query

  const { data, error } = useSWR(id ? url + id : null, fetcher)
  if (error) return <Error />
  if (!data) return <Loading />

  const okyo: OkyoProps = camelcaseKeys(data)
  const phrases: OkyoPhraseProps[] = camelcaseKeys(data.okyo_phrases)
  console.log(data)
  // VideoAndSubtitle に渡す字幕データ
  const subtitleData = phrases.map((phrase) => ({
    start: phrase.videoStartTime,
    end: phrase.videoEndTime,
    text: phrase.phraseText,
    meaning: phrase.meaning,
    reading: phrase.reading
  }))

  return (
    <Box
      css={styles.pageMinHeight}
      sx={{
        background: 'url(/unkai.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
      >
        <Box sx={{ pt: 6, pb: 3 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 21, sm: 25 },
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {okyo.name}
          </Typography>
          <Typography
            component="p"
            align="center"
            sx={{
              color: '#6e7b85',
              mt: '20px',
            }}
          >
            {okyo.createdAt}に公開
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '0 24px' }}>
          <Box sx={{ width: '100%' }}>
            <Card
              sx={{
                boxShadow: 'none',
                borderRadius: '12px',
                maxWidth: 840,
                m: '0 auto',
              }}
            >
              <Box
                sx={{
                  padding: { xs: '0 24px 24px 24px', sm: '0 40px 40px 40px' },
                  marginTop: { xs: '24px', sm: '40px' },
                }}
              >
                <Typography component="p">{okyo.description}</Typography>
              </Box>
            </Card>

            {/* 動画と字幕の表示 */}
            <Box sx={{ mt: 4 }}>
              <Typography
                component="h3"
                sx={{
                  mb: 2,
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 'bold',
                }}
              >
                動画と字幕
              </Typography>
              <VideoAndSubtitle video_url={okyo.video} phrases={subtitleData} />
            </Box>

            <Typography
              component="h3"
              sx={{
                mt: 4,
                mb: 2,
                fontSize: { xs: 18, sm: 20 },
                fontWeight: 'bold',
              }}
            >
              経文一覧
            </Typography>
            <List>
              {phrases.map((phrase) => (
                <ListItem key={phrase.id} divider>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {phrase.order}. {phrase.phraseText}
                    </Typography>
                    {phrase.reading && (
                      <Typography variant="body2" color="text.secondary">
                        読み: {phrase.reading}
                      </Typography>
                    )}
                    {phrase.meaning && (
                      <Typography variant="body2" color="text.secondary">
                        意味: {phrase.meaning}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: 300,
              minWidth: 300,
            }}
          >
            <Card sx={{ boxShadow: 'none', borderRadius: '12px' }}>
              <List sx={{ color: '#6e7b85' }}>
                <ListItem divider>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ pr: 1 }}>
                        <PersonIcon />
                      </Box>
                      <ListItemText primary="名称" />
                    </Box>
                    <Box>
                      <ListItemText primary={okyo.name} />
                    </Box>
                  </Box>
                </ListItem>
                <ListItem divider>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ pr: 1 }}>
                        <ArticleIcon />
                      </Box>
                      <ListItemText primary="公開日" />
                    </Box>
                    <Box>
                      <ListItemText primary={okyo.createdAt} />
                    </Box>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ pr: 1 }}>
                        <UpdateIcon />
                      </Box>
                      <ListItemText primary="更新日" />
                    </Box>
                    <Box>
                      <ListItemText primary={okyo.updatedAt} />
                    </Box>
                  </Box>
                </ListItem>
              </List>
            </Card>
          </Box>
        </Box>
      </Container>
    {/* </Box> */}
    </Box>
  )
}

export default OkyoDetail
