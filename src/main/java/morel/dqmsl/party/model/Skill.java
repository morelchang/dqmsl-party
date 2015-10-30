package morel.dqmsl.party.model;

public class Skill {

	private String id;
	private String name;
	private String typeId;
	private String typeName;
	private SkillType type;

	public Skill(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public SkillType getType() {
		return this.type;
	}
	
	public void setType(SkillType t) {
		this.type = t;
	}

	@Override
	public String toString() {
		return "Skill [id=" + id + ", name=" + name + ", typeName=" + typeName
				+ "]";
	}

}
