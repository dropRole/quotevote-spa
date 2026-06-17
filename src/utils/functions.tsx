const depictUserAvatar = (avatar: Blob | string) => {
  if (typeof avatar === "string") return <img src={avatar} alt="user avatar" />;

  if (avatar instanceof Blob)
    return <img src={URL.createObjectURL(avatar)} alt="user avatar" />;
};

export { depictUserAvatar };
