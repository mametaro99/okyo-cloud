/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import useSWR from "swr";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/router";
import { NextPage } from "next";
import { fetcher } from "@/utils";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import camelcaseKeys from "camelcase-keys";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { useUserState } from "@/hooks/useGlobalState";
import { styles } from "@/styles";

interface OkyoPhrase {
  id: string;
  text: string;
}

interface Okyo {
  id: string;
  name: string;
  description: string;
  phrases: OkyoPhrase[];
}

interface CeremonyOkyoGroup {
  id: string;
  name: string;
  okyos: Okyo[];
}

interface Ceremony {
  id: string;
  name: string;
  location: string;
  description: string;
  userId: number;
  ceremonyOkyoGroups: CeremonyOkyoGroup[];
}

const CeremonyDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/ceremony/";
  const { data: ceremony, error } = useSWR<Ceremony>(id ? `${url}${id}` : null, fetcher);

  const [selectedOkyo, setSelectedOkyo] = useState<Okyo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user] = useUserState();

  const handleDialogClose = () => {
    setSelectedOkyo(null);
    setDialogOpen(false);
  };

  if (error) return <Error />;
  if (!ceremony) return <Loading />;

  // camelcaseKeys で ceremony データ全体を変換
  const ceremonyData = camelcaseKeys(JSON.parse(JSON.stringify(ceremony)) as Record<string, unknown>, { deep: true }) as unknown as Ceremony;
  const isUserCreator = user.isSignedIn && user.id === ceremonyData.userId; // ユーザーが作成者か確認

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
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '16px',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
          {ceremonyData.name}
        </Typography>

        {isUserCreator && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#555' }}>
              以下のQRコードをスキャンして、本日のお経の一覧をご覧ください。
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <QRCode value={`${url}/${id}/show`} size={200} />
            </Box>
          </Box>
        )}
        <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
          {ceremonyData.description}
        </Typography>

        {ceremonyData.ceremonyOkyoGroups.map((group) => (
          <div key={group.id}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${group.id}-content`}
                id={`panel-${group.id}-header`}
              >
                <Typography variant="h6" gutterBottom>
                  {(group as any).okyo.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemText
                    secondary={
                      <>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {/* @ts-expect-error */}
                        {(group as any).okyo.okyoPhrases.map((phrase) => (
                        <div key={phrase.id}>
                          {phrase.phraseText}
                          {phrase.reading && (
                          <Typography variant="body2" color="text.secondary">
                            {phrase.reading}
                          </Typography>
                          )}
                        </div>
                        ))}
                      </Typography>
                      </>
                    }
                  />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          {selectedOkyo && (
            <>
              <DialogTitle>{selectedOkyo.name}</DialogTitle>
              <DialogContent>
                <DialogContentText>{selectedOkyo.description}</DialogContentText>
                <Typography variant="h6" gutterBottom>
                  Phrases:
                </Typography>
                <List>
                  {selectedOkyo.phrases.map((phrase) => (
                    <ListItem key={phrase.id}>
                      <ListItemText primary={phrase.text} />
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default CeremonyDetail;
