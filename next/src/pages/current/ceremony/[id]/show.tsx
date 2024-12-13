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

  const handleDialogOpen = (okyo: Okyo) => {
    setSelectedOkyo(okyo);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedOkyo(null);
    setDialogOpen(false);
  };

  if (error) return <Error />;
  if (!ceremony) return <Loading />;

  // camelcaseKeys で ceremony データ全体を変換
  const ceremonyData = camelcaseKeys(ceremony, { deep: true }) as Ceremony;
  const isUserCreator = user.isSignedIn && user.id === ceremonyData.userId; // ユーザーが作成者か確認

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {ceremonyData.name}
      </Typography>

      {isUserCreator && (
        <div>
          <Typography variant="h6" gutterBottom>
            QRコード:
          </Typography>
          <QRCode value={`${url}/${id}/show`} />
        </div>
      )}
      <Typography variant="body1" gutterBottom>
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
                {group.okyo.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                  secondary={
                    <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {group.okyo.okyoPhrases.map((phrase, index) => (
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
  );
};

export default CeremonyDetail;
