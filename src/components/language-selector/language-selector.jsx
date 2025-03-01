import { useTranslation } from "react-i18next";
import EnFlag from "../../assets/icons/en-flag";
import RuFlag from "../../assets/icons/ru-flag";
import UzFlag from "../../assets/icons/uz-flag";
import { Select } from "antd";

const LanguageSelector = () => {
  const icons = {
    en: <EnFlag />,
    uz: <UzFlag />,
    ru: <RuFlag />,
  };
  const { i18n } = useTranslation();

  return (
    <Select
      variant="borderless"
      size="small"
      value={i18n.language}
      onChange={(value) => {
        i18n.changeLanguage(value);
        document.activeElement.blur();
        localStorage.setItem("lng", value);
      }}
      options={Object.entries(icons).map(([value, icon]) => ({
        label: (
          <span className="flex items-center gap-2 font-primary font-medium text-sm">
            {icon} {value.toUpperCase()}
          </span>
        ),
        value,
      }))}
    />
  );
};

export default LanguageSelector;
