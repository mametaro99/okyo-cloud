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
} from "@mui/material";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { fetcher } from "@/utils";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import camelcaseKeys from "camelcase-keys";

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
  description: string;
  ceremonyOkyoGroups: CeremonyOkyoGroup[];
}

const CeremonyDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + "/current/ceremony/";
  const { data: ceremony, error } = useSWR<Ceremony>(id ? `${url}${id}` : null, fetcher);

  const [selectedOkyo, setSelectedOkyo] = useState<Okyo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const ceremonyOkyoGroups: CeremonyOkyoGroup[] = camelcaseKeys(ceremony.ceremonyOkyoGroups, {
    deep: true,
  }) as CeremonyOkyoGroup[];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {ceremony.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {ceremony.description}
      </Typography>

      {ceremonyOkyoGroups.map((group) => (
        <div key={group.id}>
          <Typography variant="h6" gutterBottom>
            {group.name}
          </Typography>
          <List>
            {group.okyos.map((okyo) => (
              <ListItem key={okyo.id} button onClick={() => handleDialogOpen(okyo)}>
                <ListItemText primary={okyo.name} secondary={okyo.description} />
              </ListItem>
            ))}
          </List>
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
