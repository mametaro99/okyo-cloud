// UserOkyoCard.tsx
import { Card, CardActions, CardContent, Button, Typography } from "@mui/material";
import Link from "next/link";

// Define props for the UserOkyoCard component
type UserOkyoCardProps = {
  id: string;
  name: string;
  description: string;
  sects: { name: string }[];
  userSectName?: string;
};

const UserOkyoCard: React.FC<UserOkyoCardProps> = ({ id, name, description, sects, userSectName }) => {
  const isEditable = sects.some((sect) => sect.name === userSectName);

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </Typography>
      </CardContent>
      <CardActions sx={{ marginTop: "auto", justifyContent: "space-between" }}>
        {/* Details Link */}
        <Button
          component={Link}
          href={`/current/okyos/${id}`}
          variant="contained"
          color="secondary"
          sx={{
            color: "white",
            textTransform: "none",
            fontSize: 16,
            borderRadius: 2,
            width: 100,
            boxShadow: "none",
          }}
        >
          詳細
        </Button>

        {/* Edit Link if user sect matches */}
        {isEditable && (
          <Button
            component={Link}
            href={`/current/okyos/${id}/edit`}
            variant="contained"
            color="primary"
            sx={{
              color: "white",
              textTransform: "none",
              fontSize: 16,
              borderRadius: 2,
              width: 100,
              boxShadow: "none",
            }}
          >
            編集
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default UserOkyoCard;