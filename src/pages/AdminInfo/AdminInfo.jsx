import styles from "./styles.module.scss";
import Card from "@components/Card/Card";
import CardContent from "@components/Card/CardContent/CardContent";
import Button from "@components/ui/Button/Button";
import Input from "@components/ui/Input/Input";
import { useState } from "react";
import { IoSave } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
function AdminInfo() {
  const {
    container,
    header,
    title,
    avatarContainer,
    avatar,
    icon,
    gridCols2,
    spaceY2,
    fallbackAvatar,
  } = styles;

  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>Admin Information</h2>
          <p>Update your account profile information.</p>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className={avatarContainer}>
            <div className={avatar}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Admin Avatar" />
              ) : (
                <div className={fallbackAvatar}>AD</div>
              )}
            </div>
            <input
              type="file"
              id="avatarInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleAvatarChange}
            />

            {/* button trigger input file */}
            <Button
              content="Change Avatar"
              icon={<MdAddAPhoto size={20} style={{ marginRight: "7px" }} />}
              isPrimary={false}
              onClick={() => document.getElementById("avatarInput").click()}
            />
          </div>
          <div style={{ border: ".5px solid #ddd", margin: "20px 0" }}></div>
          <div className={gridCols2}>
            <div className={spaceY2}>
              <label>
                <span>First Name</span>
              </label>
              <Input
                label="First Name"
                type="text"
                placeholder="Enter first name"
              />
            </div>
            <div className={spaceY2}>
              <label>
                <span>Last Name</span>
              </label>
              <Input
                label="Last Name"
                type="text"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className={spaceY2}>
            <label>
              <span>Email </span>
            </label>
            <Input label="Email " type="email" placeholder="Enter email " />
          </div>
          <div className={spaceY2}>
            <label>
              <span>Bio </span>
            </label>
            <Input
              label="Bio "
              type="textarea"
              placeholder="Tell us about yourself "
            />
          </div>
          <Button
            content="Update Profile"
            icon={<IoSave size={20} style={{ marginRight: "7px" }} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminInfo;
