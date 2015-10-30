package morel.dqmsl.party.data;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import morel.dqmsl.party.model.Skill;
import morel.dqmsl.party.model.SkillType;

import com.cedarsoftware.util.io.JsonReader;
import com.cedarsoftware.util.io.JsonWriter;

public class JsonFileSkillDao {

	private Map<String, Skill> skills;
	private Map<String, SkillType> skillTypes;

	public void saveSkill(Map<String, String> skills) throws IOException {
		writeJson(skills, "./data/skills.json");
	}

	private void writeJson(Map<String, String> skills, String path)
			throws IOException {
		String json = JsonWriter.objectToJson(skills);
		FileWriter fw = new FileWriter(new File(path));
		fw.write(json);
		fw.flush();
		fw.close();
	}

	public void saveCharacteristics(Map<String, String> chars) throws IOException {
		writeJson(chars, "./data/chars.json");
	}

	public Skill findSkill(String skillId) {
		if (this.skills == null) {
			// lazy init skills
			Map<String, String> map = readJsonToMap("./data/skills.json");
			this.skills = map.entrySet().stream().collect(
					Collectors.toMap(Map.Entry::getKey, e -> new Skill(e.getKey(), e.getValue())));
			// link skill and skillType
			arrangeType(this.skills);
		}
		return this.skills.get(skillId);
	}
	
	private void arrangeType(Map<String, Skill> skills) {
		for (Skill s : skills.values()) {
			if (s.getId().equals("0")) {
				continue;
			}
			
			SkillType t = findSkillTypeBySkillId(s.getId());
			if (t == null) {
				System.out.println("failed to find skilType by skillId:" + s.getId() + ", skillName:" + s.getName());
				continue;
			}
			s.setType(t);
			s.setTypeId(t.getId());
			s.setTypeName(t.getName());
		}
	}

	private SkillType findSkillTypeBySkillId(String id) {
		if (id.length() == 5) {
			return findSkillType(id.substring(0, 3));
		} else if (id.length() == 4) {
			return findSkillType(id.substring(0, 2));
		}
		return null;
	}

	public SkillType findSkillType(String typeId) {
		if (this.skillTypes == null) {
			Map<String, String> map = readJsonToMap("./data/skillTypes.json");
			this.skillTypes = map.entrySet().stream().collect(
					Collectors.toMap(Map.Entry::getKey, e -> new SkillType(e.getKey(), e.getValue())));
		}
		return this.skillTypes.get(typeId);
	}

	private Map<String, String> readJsonToMap(String path) {
		FileInputStream inputStream;
		try {
			inputStream = new FileInputStream(new File(path));
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		}
		Map<String, Object> oa = new TreeMap<String, Object>();
		Map<String, String> result = JsonReader.jsonToMaps(inputStream, oa);
		return result;
	}
	
}
