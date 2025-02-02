import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import { useSnackbarState, useUserState } from '@/hooks/useGlobalState';
import { useRequireSignedIn } from '@/hooks/useRequireSignedIn';
import { styles } from '@/styles';
import { fetcher } from '@/utils';

type OkyoProps = {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  articleUrl: string;
  published: boolean;
  okyoPhrases: OkyoPhraseProps[];
};

type OkyoPhraseProps = {
  id: number;
  phraseText: string;
  meaning: string;
  reading: string;
  videoStartTime: number;
  videoEndTime: number;
  order: string;
};

const OkyoForm: NextPage = () => {
  const router = useRouter();
  useRequireSignedIn();
  const [user] = useUserState();
  const [, setSnackbar] = useSnackbarState();
  const [isLoading, setIsLoading] = useState(false);
  const [okyo, setOkyo] = useState<Partial<OkyoProps>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingPhraseId, setEditingPhraseId] = useState<number | null>(null);
  const [editingPhraseText, setEditingPhraseText] = useState<string>('');
  const [phrases, setPhrases] = useState<OkyoPhraseProps[]>([]);
  const [editingPhraseMeaning, setEditingPhraseMeaning] = useState<string>('');
  const [editingPhraseStartTime, setEditingPhraseStartTime] = useState<number>(0);
  const [editingPhraseEndTime, setEditingPhraseEndTime] = useState<number>(0);
  const [editingPhraseReading, setEditingPhraseReading] = useState<string>('');
  const [creatingPhraseText, setCreatingPhraseText] = useState<string>('');
  const [creatingPhraseMeaning, setCreatingPhraseMeaning] = useState<string>('');
  const [creatingPhraseStartTime, setCreatingPhraseStartTime] = useState<string>('');
  const [creatingPhraseEndTime, setCreatingPhraseEndTime] = useState<string>('');
  const [creatingPhraseReading, setCreatingPhraseReading] = useState<string>('');

  const [phraseSaved, setPhraseSaved] = useState(false);

  const { id } = router.query;
  const okyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/okyo/${id}`;
  const updateOkyoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo/${id}`;
  const phraseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/current/okyo/${id}/okyo_phrase`;
  const { data: okyoData, error: okyoError, mutate } = useSWR(okyoUrl, fetcher);

  useEffect(() => {
    if (!router.isReady) return;
    if (!user.isSignedIn) return;
    if (okyoError) return;
    if (!okyoData) return;

    const loadedOkyo: OkyoProps = camelcaseKeys(okyoData);
    const okyoPhrases: OkyoPhraseProps[] = loadedOkyo.okyoPhrases.map((phrase: OkyoPhraseProps) => camelcaseKeys(phrase));

    setOkyo(loadedOkyo);
    setPhrases(okyoPhrases);
  }, [router.isReady, user.isSignedIn, okyoError, okyoData]);

  useEffect(() => {
    if (phraseSaved) {
      mutate();
      setPhraseSaved(false);
    }
  }, [phraseSaved, mutate]);

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

    if (file) {
      formData.append('okyo[video]', file);
    }

    try {
      await axios.put(updateOkyoUrl, formData, { headers });
      setSnackbar({
        message: '編集を保存しました',
        severity: 'success',
        pathname: router.pathname,
      });

      router.push(`/okyos/${id}`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';
      setSnackbar({
        message: `編集に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPhrase = (
    phraseId: number,
    phraseText: string,
    meaning: string,
    reading: string,
    startTime: number,
    endTime: number
  ) => {
    setEditingPhraseId(phraseId);
    setEditingPhraseText(phraseText);
    setEditingPhraseMeaning(meaning);
    setEditingPhraseReading(reading);
    setEditingPhraseStartTime(startTime);
    setEditingPhraseEndTime(endTime);
  };

  const handleSavePhrase = async (phraseId: number) => {
    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    try {
      await axios.patch(`${phraseUrl}/${phraseId}`, {
        okyo_phrase: {
          phrase_text: editingPhraseText,
          meaning: editingPhraseMeaning,
          reading: editingPhraseReading,
          video_start_time: editingPhraseStartTime,
          video_end_time: editingPhraseEndTime,
        },
      }, { headers });
      setSnackbar({
        message: 'フレーズを保存しました',
        severity: 'success',
        pathname: router.pathname,
      });

      setEditingPhraseId(null);
      setEditingPhraseText('');
      setEditingPhraseMeaning('');
      setEditingPhraseReading('');
      setEditingPhraseStartTime(0);
      setEditingPhraseEndTime(0);
      setPhraseSaved(true);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      setSnackbar({
        message: `フレーズの保存に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPhraseId(null);
    setEditingPhraseText('');
    setEditingPhraseMeaning('');
    setEditingPhraseReading('');
    setEditingPhraseStartTime(0);
    setEditingPhraseEndTime(0);
  };

  const handleCreatePhrase = async () => {
    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    // お経フレーズの中で最大のorderを取得（Rails側でorderの昇順にphraseを並べているため、phraseの最後の要素のorderを取得する。何もない場合は、1を指定する。）
    const maxOrder: number = phrases.length > 0 ? parseInt(phrases[phrases.length - 1].order, 10) : 1;
    

    try {
      await axios.post(`${phraseUrl}`, {
        okyo_phrase: {
          phrase_text: creatingPhraseText,
          meaning: creatingPhraseMeaning,
          reading: creatingPhraseReading,
          video_start_time: creatingPhraseStartTime,
          video_end_time: creatingPhraseEndTime,
          order: maxOrder + 1,
        },
      }, { headers });
      setSnackbar({
        message: 'フレーズを新規作成しました',
        severity: 'success',
        pathname: router.pathname,
      });

      setCreatingPhraseText('');
      setCreatingPhraseMeaning('');
      setCreatingPhraseReading('');
      setCreatingPhraseStartTime(0);
      setCreatingPhraseEndTime(0);
      setPhraseSaved(true);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      setSnackbar({
        message: `フレーズの作成に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    }
  };

  const handleDeletePhrase = async (phraseId: number) => {
    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    try {
      await axios.delete(`${phraseUrl}/${phraseId}`, { headers });
      setSnackbar({
        message: 'フレーズを削除しました',
        severity: 'success',
        pathname: router.pathname,
      });

      setPhraseSaved(true);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      setSnackbar({
        message: `フレーズの削除に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    }
  }

  const handleDragEnd = async (event: React.DragEvent, index: number) => {
    // ドラッグ＆ドロップで並べ替え処理を実装
    const beforeOrder = phrases[index].order;
    const nextIndex = index + (event.clientY > event.currentTarget.getBoundingClientRect().top ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= phrases.length) return;
    const afterOrder = phrases[nextIndex].order;

    if (beforeOrder === afterOrder) return;

    const headers = {
      'access-token': localStorage.getItem('access-token'),
      client: localStorage.getItem('client'),
      uid: localStorage.getItem('uid'),
    };

    try {
      await axios.patch(`${phraseUrl}/${index}/sort_by`, {
        before_order: beforeOrder,
        after_order: afterOrder,
      }, { headers });

      setSnackbar({
        message: 'フレーズの順序を更新しました',
        severity: 'success',
        pathname: router.pathname,
      });

      mutate();
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError && err.response
          ? err.response.data.message || '不明なエラーが発生しました'
          : 'ネットワークエラーが発生しました';

      setSnackbar({
        message: `フレーズの順序更新に失敗しました: ${errorMessage}`,
        severity: 'error',
        pathname: router.pathname,
      });
    }


  };

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <Box css={styles.pageMinHeight} sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        お経の編集
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

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            aria-label="published"
            name="published"
            value={okyo.published ? 'true' : 'false'}
            onChange={(e) => setOkyo({ ...okyo, published: e.target.value === 'true' })}
          >
            <FormControlLabel value="true" control={<Radio />} label="公開" />
            <FormControlLabel value="false" control={<Radio />} label="非公開" />
          </RadioGroup>
        </FormControl>

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
            保存
          </LoadingButton>
        </Box>
      </form>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">お経フレーズ</Typography>
        <p>※フレーズのカードをドラック＆ドロップすることで順番を変更することができます。</p>
        {phrases.map((phrase, index) => (
          <Card key={phrase.id} sx={{ mb: 2 }} draggable onDragEnd={(e) => handleDragEnd(e, index)}>
            <CardContent>
              {editingPhraseId === phrase.id ? (
                <Box>
                  <TextField
                    fullWidth
                    label="フレーズ"
                    value={editingPhraseText}
                    onChange={(e) => setEditingPhraseText(e.target.value)}
                    autoFocus
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="意味"
                    value={editingPhraseMeaning}
                    onChange={(e) => setEditingPhraseMeaning(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="読み方"
                    value={editingPhraseReading}
                    onChange={(e) => setEditingPhraseReading(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="開始時間"
                    type="number"
                    value={editingPhraseStartTime}
                    onChange={(e) => setEditingPhraseStartTime(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="終了時間"
                    type="number"
                    value={editingPhraseEndTime}
                    onChange={(e) => setEditingPhraseEndTime(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => handleCancelEdit()}>キャンセル</Button>
                    <Button onClick={() => handleSavePhrase(phrase.id)} color="primary">
                      保存
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6">{phrase.phraseText}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {phrase.meaning}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      読み方: {phrase.reading}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      開始時間: {phrase.videoStartTime}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      終了時間: {phrase.videoEndTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      onClick={() => handleEditPhrase(phrase.id, phrase.phraseText, phrase.meaning, phrase.reading, phrase.videoStartTime, phrase.videoEndTime)}
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontSize: 14,
                        borderRadius: 2,
                        width: 70,
                        boxShadow: 'none',
                        mr: 2,
                        ml: 1,
                        mt: 1,
                      }}
                      color="primary"
                      variant="contained"
                    >
                      編集
                    </Button>
                    <Button 
                      onClick={() => handleDeletePhrase(phrase.id)} 
                      color="error"
                      variant="contained"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontSize: 14,
                        borderRadius: 2,
                        width: 70,
                        boxShadow: 'none',
                        mt: 1,
                      }}
                    >
                      削除
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
        {/* 新しいフレーズを追加 */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">新しいフレーズを追加</Typography>
            <TextField
              fullWidth
              label="フレーズ"
              value={creatingPhraseText}
              onChange={(e) => setCreatingPhraseText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="意味"
              value={creatingPhraseMeaning}
              onChange={(e) => setCreatingPhraseMeaning(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="読み方"
              value={creatingPhraseReading}
              onChange={(e) => setCreatingPhraseReading(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="開始時間"
              type="number"
              value={creatingPhraseStartTime}
              onChange={(e) => setCreatingPhraseStartTime(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="終了時間"
              type="number"
              value={creatingPhraseEndTime}
              onChange={(e) => setCreatingPhraseEndTime(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => handleCreatePhrase()} color="primary">
                保存
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OkyoForm;
