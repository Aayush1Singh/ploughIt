import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function Tags({ setValue, options, label }) {
  if (!options) options = [];
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      onChange={(event, newValue) => {
        setValue([...newValue]);
      }}
      options={options.map((option) => option.title)}
      // defaultValue={[top100Films[13].title]}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip variant="outlined" label={option} key={key} {...tagProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Favorites" />
      )}
    />
  );
}
