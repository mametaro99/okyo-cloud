import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSnackbarState } from '@/hooks/useGlobalState';
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn';
import { styles } from '@/styles';

type OkyoProps = {
  name: string;
  description: string;
  videoUrl?: string;
  articleUrl?: string;
  published: boolean;
};

type Sect = {
  id: number;
  name: string;
};

const CreateOkyoForm: React.FC = () => {
  const router = useRouter();
  useRequireSignedIn();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);
  const [okyo, setOkyo] = useState<Partial<OkyoProps>>({ published: false });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sects, setSects] = useState<Sect[]>([]); // Sect一覧
  const [selectedSects, setSelectedSects] = useState<number[]>([]); // 選択されたsect_ids

  const createOkyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo`;
  const sectsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sect`;

  // Sect一覧を取得
  useEffect(() => {
    const fetchSects = async () => {
      try {
        const response = await axios.get<Sect[]>(sectsUrl);
        setSects(response.data);
      } catch (err) {
        console.error('Error fetching sects:', err);
      }
    };
    fetchSects();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      const filePreview = URL.createObjectURL(uploadedFile);
      setPreviewUrl(filePreview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    const formData = new FormData();
    formData.append('okyo[name]', okyo.name || '');
    formData.append('okyo[description]', okyo.description || '');
    formData.append('okyo[article_url]', okyo.articleUrl || '');
    formData.append('okyo[published]', String(okyo.published || false));
    selectedSects.forEach((id) => formData.append('okyo[sect_ids][]', String(id)));

    if (file) {
      formData.append('okyo[video]', file);
    }

    try {
      const response = await axios.post(createOkyoUrl, formData, { headers });
      const createdOkyoId = response.data.id;

      setSnackbar({
        message: '新規作成しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/current/okyos/${createdOkyoId}/edit`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      console.error('Submission error:', err);
      setSnackbar({
        message: `新規作成に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box css={styles.pageMinHeight}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        お経の新規作成
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="名前"
          value={okyo.name || ''}
          onChange={(e) => setOkyo({ ...okyo, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="説明"
          value={okyo.description || ''}
          onChange={(e) => setOkyo({ ...okyo, description: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="記事のURL"
          value={okyo.articleUrl || ''}
          onChange={(e) => setOkyo({ ...okyo, articleUrl: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="sect-select-label">宗派</InputLabel>
          <Select
            labelId="sect-select-label"
            multiple
            value={selectedSects}
            onChange={(e) => setSelectedSects(e.target.value as number[])}
            renderValue={(selected) =>
              sects
                .filter((sect) => selected.includes(sect.id))
                .map((sect) => sect.name)
                .join(', ')
            }
          >
            {sects.map((sect) => (
              <MenuItem key={sect.id} value={sect.id}>
                {sect.name}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="error" sx={{ mb: 2 }}>
            選択した宗派の人がこのお経を編集することができます。
          </Typography>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">動画または音声ファイル</Typography>
          <input type="file" accept="video/mp4,audio/mp3" onChange={handleFileChange} />
          {previewUrl && (
            <Box sx={{ mt: 2 }}>
              {file?.type.startsWith('video') ? (
                <video src={previewUrl} controls width="100%" />
              ) : (
                <audio src={previewUrl} controls />
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
            variant="contained"
            color="primary"
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: 16,
              borderRadius: 2,
              width: 100,
              boxShadow: 'none',
            }}
          >
            作成
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default CreateOkyoForm;