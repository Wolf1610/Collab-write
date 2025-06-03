import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {

    const accessChangeHandler = (type: UserType ) => {
        setUserType(type);
         onClickHandler && onClickHandler(type);
    }

  return (
    <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
      <SelectTrigger className="w-[105px] bg-black">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="bg-black text-white">
        <SelectItem value="viewer">can view</SelectItem>
        <SelectItem value="editor">can edit</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
