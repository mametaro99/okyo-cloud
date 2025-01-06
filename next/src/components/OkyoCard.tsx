import { Card, CardContent, Typography } from '@mui/material'

type OkyoCardProps = {
  name: string
  description: string
}

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

const OkyoCard = (props: OkyoCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography
          component="h3"
          sx={{
            mb: 2,
            minHeight: 48,
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 1.5,
          }}
        >
          {omit(props.name)(45)('...')}
        </Typography>
        <Typography sx={{ mb: 2, fontSize: 14, color: 'text.secondary' }}>
          {omit(props.description)(60)('...')}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default OkyoCard
