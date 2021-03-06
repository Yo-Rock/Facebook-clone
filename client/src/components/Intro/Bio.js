import { useContext } from "react";
import { ProfileContext } from "../../profileContext/Context";

function Bio({ placeholder, name, detail, setShow, rel }) {
  const { infos, handleChange, max, setShowBio, updateDetails } =
    useContext(ProfileContext);

  return (
    <div className="add_bio_wrap">
      {rel ? (
        <select
          name={name}
          value={infos.relationship}
          onChange={handleChange}
          className="select_rel"
        >
          <option value="Single">Single</option>
          <option value="In a relationship">In a relationship</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
      ) : (
        <textarea
          name={name}
          placeholder={placeholder}
          value={infos?.[name]}
          maxLength={100}
          className="textarea_blue details_input"
          onChange={handleChange}
        ></textarea>
      )}

      {!detail && <div className="remaining">{max} characters remaining</div>}
      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i>
        </div>
        <div className="flex flex_right">
          <button
            className="gray_btn"
            onClick={() => (!detail ? setShowBio(false) : setShow(false))}
          >
            Cancel
          </button>
          <button
            className="blue_btn"
            onClick={() => {
              updateDetails();
              setShow(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bio;
