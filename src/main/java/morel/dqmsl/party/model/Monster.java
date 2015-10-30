package morel.dqmsl.party.model;

import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.TreeMap;



public class Monster {

	public enum Type {
		ATT, DEF, REC, MAG, AUX, UNI, SPE
	}

	public enum System {
		SLIME, DRAGON, BEAST, NATURE, SUBSTANCE, DEVIL, ZOMBIE, MAOU, REINCARNATION
	}

	public enum Rank {
		SS, S, A, B, C, D, E, F
	}
	
	public enum ResistanceType {
		FIRE, ICE, THANDER, WIND, EXPLODE, LIGHT, DARK, DEATH, INMAGIC, MISS, TOXIC, SLEEP, CONFUSION, STOP, INBREATH
	}
	
	public enum ResistanceReaction {
		REFLECT, ABSORB, VOID, HELF, LOT, LITTLE, WEEK, VERY_WEEK 
	}
	
	public static class Resistance {
		private ResistanceType resistanceType;
		private ResistanceReaction resistanceReaction;
		public Resistance(ResistanceType resistanceType, ResistanceReaction resistanceReaction) {
			super();
			this.resistanceType = resistanceType;
			this.resistanceReaction = resistanceReaction;
		}
		public ResistanceType getResistanceType() {
			return resistanceType;
		}
		public ResistanceReaction getResistanceReaction() {
			return resistanceReaction;
		}
	}

	// system attr
	private int no;
	private String name;
	private String icon;
	private int viewedNum;
	private int likeNum;
	private int dislikeNum;
	private Rank rank;
	private Type type;
	private System system;
	private int weight;
	private int maxLevel;
	
	// 6 attr
	private int hp;
	private int mp;
	private int offense;
	private int defense;
	private int dexterity;
	private int intelligent;

	// taisei
	private Map<ResistanceType, ResistanceReaction> resistances = new TreeMap<>();
	
	// skills
	private Map<String, Skill> skills = new TreeMap<>();

	// tokusei
	
	// leader tokusei
	
	// max-level exp
	
	// reincarnation eggs
	
	public Map<String, Skill> getSkills() {
		return skills;
	}

	public void setSkills(Map<String, Skill> skills) {
		this.skills = skills;
	}

	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public int getViewedNum() {
		return viewedNum;
	}

	public void setViewedNum(int viewedNum) {
		this.viewedNum = viewedNum;
	}

	public int getLikeNum() {
		return likeNum;
	}

	public void setLikeNum(int likeNum) {
		this.likeNum = likeNum;
	}

	public int getDislikeNum() {
		return dislikeNum;
	}

	public void setDislikeNum(int dislikeNum) {
		this.dislikeNum = dislikeNum;
	}

	public Rank getRank() {
		return rank;
	}

	public void setRank(Rank rank) {
		this.rank = rank;
	}

	public System getSystem() {
		return system;
	}

	public void setSystem(System system) {
		this.system = system;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public int getMaxLevel() {
		return maxLevel;
	}

	public void setMaxLevel(int maxLevel) {
		this.maxLevel = maxLevel;
	}

	public Type getType() {
		return this.type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public int getHp() {
		return hp;
	}

	public void setHp(int hp) {
		this.hp = hp;
	}

	public int getMp() {
		return mp;
	}

	public void setMp(int mp) {
		this.mp = mp;
	}

	public int getOffense() {
		return offense;
	}

	public void setOffense(int offense) {
		this.offense = offense;
	}

	public int getDefense() {
		return defense;
	}

	public void setDefense(int defense) {
		this.defense = defense;
	}

	public int getDexterity() {
		return dexterity;
	}

	public void setDexterity(int dexterity) {
		this.dexterity = dexterity;
	}

	public int getIntelligent() {
		return intelligent;
	}

	public void setIntelligent(int intelligent) {
		this.intelligent = intelligent;
	}

	public void addResistance(Resistance res) {
		this.resistances.put(res.getResistanceType(), res.getResistanceReaction());
	}
	
	@Override
	public String toString() {
		return "no:" + this.getNo() + " name:" + this.getName() + ", rank:" + this.getRank() + ", type:" + this.getSystem() + "\n" +
				" hp:" + this.getHp() + "\n" +
				" mp:" + this.getMp() + "\n" +
				" off:" + this.getOffense() + "\n" +
				" def:" + this.getDefense() + "\n" +
				" dex:" + this.getDexterity() + "\n" +
				" int:" + this.getIntelligent() + "\n" + 
				" resistance:\n" + getResistanceString() +
				" skills:\n" + getSkillsString();
	}

	private String getSkillsString() {
		return this.skills.entrySet().stream().map(e -> "    " + e.getValue()).collect(Collectors.joining("\n"));
	}

	private String getResistanceString() {
		String result = "";
		Set<Entry<ResistanceType, ResistanceReaction>> resSet = this.resistances.entrySet();
		for (Entry<ResistanceType, ResistanceReaction> e : resSet) {
			result += "   " + e.getKey() + ":" + e.getValue() + "\n";
		}
		return result;
	}
	
}
